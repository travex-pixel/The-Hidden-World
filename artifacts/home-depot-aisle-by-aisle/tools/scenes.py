import cv2, numpy as np
OUT="raw"
def cylinder(img, x, y, w, h, body, label, rim=(200,200,205)):
    # body with horizontal shading (BGR)
    for i in range(w):
        t = i / (w - 1)
        shade = 0.55 + 0.6 * np.sin(np.pi * (0.15 + 0.7 * t)) - 0.25 * t
        col = np.clip(np.array(body) * shade, 0, 255)
        cv2.line(img, (x + i, y), (x + i, y + h), col.tolist(), 1)
        lt = np.clip(np.array(label) * shade, 0, 255)
        cv2.line(img, (x + i, y + int(h * 0.28)), (x + i, y + int(h * 0.78)), lt.tolist(), 1)
        st = np.clip(np.array((245, 245, 245)) * shade, 0, 255)
        cv2.line(img, (x + i, y + int(h * 0.46)), (x + i, y + int(h * 0.56)), st.tolist(), 1)
    ey = max(6, w // 7)
    cv2.ellipse(img, (x + w // 2, y + h), (w // 2, ey), 0, 0, 180, (np.array(body) * 0.45).tolist(), -1)
    cv2.ellipse(img, (x + w // 2, y), (w // 2, ey), 0, 0, 360, rim, -1)
    cv2.ellipse(img, (x + w // 2, y), (w // 2 - 6, ey - 3), 0, 0, 360, (150, 150, 158), 2)
    cv2.ellipse(img, (x + w // 2, y), (w // 2, ey), 0, 0, 360, (110, 110, 118), 2)

def paint_cans():
    W, H = 1400, 1120
    img = np.full((H, W, 3), 250, np.uint8)
    # floor shadow
    cv2.ellipse(img, (W // 2, 1025), (560, 45), 0, 0, 360, (215, 214, 210), -1)
    w, h = 150, 150
    rows = [6, 5, 4, 3, 2, 1]
    oranges = [(30, 110, 240), (40, 125, 235), (25, 100, 225)]
    blues = [(150, 95, 45), (170, 120, 70)]
    base_y = 1000 - h
    rng = np.random.default_rng(4)
    for r, n in enumerate(rows):
        y = base_y - r * (h - 8)
        x0 = W // 2 - n * w // 2
        for c in range(n):
            lab = oranges[rng.integers(0, 3)] if rng.random() < 0.7 else blues[rng.integers(0, 2)]
            body = (200, 200, 206)
            cylinder(img, x0 + c * w + rng.integers(-4, 5), y, w - 8, h - 14, body, lab)
    cv2.imwrite(f"{OUT}/paintcans.jpg", img)

def horseshoe():
    W, H = 1100, 1100
    img = np.full((H, W, 3), 250, np.uint8)
    cx, cy = 550, 520
    # shadow
    sh = np.full_like(img, 250)
    cv2.ellipse(sh, (cx + 30, cy + 40), (330, 360), 0, -20, 200, (205, 205, 200), 120)
    img = cv2.min(img, cv2.GaussianBlur(sh, (0, 0), 18))
    # gold body: draw many concentric arcs with shading across thickness
    th = 130
    for k in range(th):
        t = k / th
        shade = 0.55 + 0.75 * np.sin(np.pi * t) ** 0.8
        gold = np.clip(np.array((40, 160, 215)) * shade + 25 * np.sin(np.pi * t) ** 6, 0, 255)
        r = 300 - th // 2 + k
        cv2.ellipse(img, (cx, cy), (r, int(r * 1.08)), 0, -25, 205, gold.tolist(), 2)
    # heels
    for ang in (-25, 205):
        a = np.deg2rad(ang)
        for k in range(th):
            pass
    # nail holes
    for ang in np.linspace(-10, 190, 8):
        a = np.deg2rad(ang)
        r = 300
        x, y = int(cx + r * np.cos(a)), int(cy + r * 1.08 * np.sin(a))
        rect = ((x, y), (16, 34), ang + 90)
        box = cv2.boxPoints(rect).astype(np.int32)
        cv2.fillPoly(img, [box], (30, 70, 95))
    # groove
    cv2.ellipse(img, (cx, cy), (300, 324), 0, -18, 198, (20, 110, 160), 3)
    # highlight
    cv2.ellipse(img, (cx, cy), (262, 283), 0, 120, 175, (190, 235, 250), 6)

    cv2.imwrite(f"{OUT}/horseshoe.jpg", img)

paint_cans(); horseshoe()
