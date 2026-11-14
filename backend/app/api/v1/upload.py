from fastapi import APIRouter, UploadFile, File, HTTPException, status
from PIL import Image
import os
import uuid
import io

router = APIRouter(prefix="/upload", tags=["Media & Image Uploads"])

# Upload directory targets frontend/public/uploads so Next.js immediately serves it
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
UPLOAD_DIR = os.path.join(BASE_DIR, "frontend", "public", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_DIMENSION = 1024

@router.post("/image")
async def upload_image(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Faqat rasm fayllari (JPG, PNG, WEBP) qabul qilinadi")

    contents = await file.read()
    if len(contents) > 15 * 1024 * 1024: # 15MB max input limit
        raise HTTPException(status_code=400, detail="Rasm hajmi 15MB dan oshmasligi lozim")

    try:
        img = Image.open(io.BytesIO(contents))
        img.verify() # Verify file is valid image
        img = Image.open(io.BytesIO(contents)) # Re-open after verify
    except Exception as e:
        raise HTTPException(status_code=400, detail="Rasm faylini ochib bo'lmadi")

    # Resize if exceeds 1024px in width or height
    orig_w, orig_h = img.size
    new_w, new_h = orig_w, orig_h

    if orig_w > MAX_DIMENSION or orig_h > MAX_DIMENSION:
        if orig_w >= orig_h:
            new_w = MAX_DIMENSION
            new_h = int((orig_h / orig_w) * MAX_DIMENSION)
        else:
            new_h = MAX_DIMENSION
            new_w = int((orig_w / orig_h) * MAX_DIMENSION)

        # High quality resizing
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Convert mode if needed (e.g. RGBA for WebP is fine, CMYK converted to RGB)
    if img.mode in ("CMYK", "P"):
        img = img.convert("RGB")

    filename = f"{uuid.uuid4().hex}.webp"
    save_path = os.path.join(UPLOAD_DIR, filename)

    # Save as optimized WebP
    img.save(save_path, format="WEBP", quality=88, optimize=True)

    return {
        "success": True,
        "url": f"/uploads/{filename}",
        "width": new_w,
        "height": new_h,
        "original_width": orig_w,
        "original_height": orig_h
    }
