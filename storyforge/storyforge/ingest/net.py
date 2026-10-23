"""All HTTP goes through here: browser-like headers, timeouts, retry with backoff."""
from __future__ import annotations

import os
import re
import shutil
import time
import urllib.error
import urllib.request
from urllib.parse import unquote, urlparse

from . import IngestError

USER_AGENT = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
              "(KHTML, like Gecko) Chrome/129.0 Safari/537.36")
TIMEOUT_S = 30
RETRIES = 3
RETRY_STATUS = {429, 500, 502, 503, 504}


def _open(url: str, timeout: float):
    """Open ``url`` with retries on 429/5xx and transient network errors."""
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "*/*"})
    for attempt in range(RETRIES + 1):
        try:
            return urllib.request.urlopen(req, timeout=timeout)
        except urllib.error.HTTPError as e:
            if e.code not in RETRY_STATUS or attempt == RETRIES:
                raise IngestError(f"GET {url} failed: HTTP {e.code} {e.reason}") from e
            retry_after = e.headers.get("Retry-After", "")
            delay = float(retry_after) if retry_after.isdigit() else 2 ** attempt
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            if attempt == RETRIES:
                raise IngestError(f"GET {url} failed: {e}") from e
            delay = 2 ** attempt
        time.sleep(min(delay, 30))
    raise AssertionError("unreachable")


def fetch(url: str, timeout: float = TIMEOUT_S) -> tuple[bytes, str]:
    """GET ``url`` (http(s) or file://) and return ``(body, content_type)``."""
    with _open(url, timeout) as resp:
        body = resp.read()
        content_type = resp.headers.get("Content-Type", "") or ""
    return body, content_type.split(";")[0].strip().lower()


def fetch_text(url: str) -> tuple[str, str]:
    """Like :func:`fetch` but decoded as UTF-8 (lenient)."""
    body, content_type = fetch(url)
    return body.decode("utf-8", errors="replace"), content_type


def download(url: str, workdir: str, filename: str | None = None) -> str:
    """Stream ``url`` into ``workdir`` and return the local path."""
    name = filename or safe_name(unquote(os.path.basename(urlparse(url).path)) or "download")
    path = os.path.join(workdir, name)
    with _open(url, TIMEOUT_S) as resp, open(path, "wb") as out:
        shutil.copyfileobj(resp, out, length=1 << 20)
    return path


def safe_name(name: str) -> str:
    """A filesystem-safe file name."""
    return re.sub(r"[^\w.\-]+", "_", name).strip("._")[:120] or "download"
