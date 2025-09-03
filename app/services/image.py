from io import BytesIO
from PIL import Image

from app.config import settings 

async def convert_image(file_bytes: bytes, target_format: str) -> bytes:
    with Image.open(BytesIO(file_bytes)) as img:
        output = BytesIO()
        img.save(output, format=target_format)
        output.seek(0)
        return output.getvalue()

async def resize_image(file_bytes: bytes, target_format: str, width: int | None = None, height: int | None = None) -> bytes:
    with Image.open(BytesIO(file_bytes)) as img:
        new_width: int | None = width if width and width > 0 else None
        new_height: int | None = height if height and height > 0 else None

        if new_width is not None and new_height is not None:
            target_size = (new_width, new_height)
            img = img.resize(target_size, resample=Image.LANCZOS)
        elif new_width is not None and new_height is None:
            ratio = new_width / img.width
            target_size = (new_width, max(1, int(img.height * ratio)))
            img = img.resize(target_size, resample=Image.LANCZOS)
        elif new_height is not None and new_width is None:
            ratio = new_height / img.height
            target_size = (max(1, int(img.width * ratio)), new_height)
            img = img.resize(target_size, resample=Image.LANCZOS)
        # else: keep original size

        normalized_format = settings.image.allowed_formats.get(target_format.lower(), target_format.upper())
        output = BytesIO()
        img.save(output, format=normalized_format)
        output.seek(0)
        return output.getvalue()
    
async def decrease_image(file_bytes: bytes, target_format:str, width :int = None, height: int = None) -> bytes:
    size: tuple[int, int] = (width, height)
    with Image.open(BytesIO(file_bytes)) as img:
        if width and height:
            img.thumbnail(size, resample=Image.LANCZOS, reducing_gap=3.0)
        normalized_format = settings.image.allowed_formats.get(target_format.lower(), target_format.upper())
        output = BytesIO()
        img.save(output, format=normalized_format)
        output.seek(0)
        return output.getvalue()
    
async def get_image_info(file_bytes: bytes) -> dict:
    with Image.open(BytesIO(file_bytes)) as img:
        return {
            "format": img.format,
            "size": img.size,
            "info": img.info
        }
        
async def cutting_image(file_bytes: bytes, target_format: str, left: int, upper: int, right: int, lower: int) -> bytes:
    cut = (left, upper, right, lower)
    try:
        with Image.open(BytesIO(file_bytes)) as img:
            if 0 <= left < right <= img.width and 0 <= upper < lower <= img.height:
                img = img.crop(cut)
            normalized_format = settings.image.allowed_formats.get(target_format.lower(), target_format.upper())
            output = BytesIO()
            img.save(output, format=normalized_format)
            output.seek(0)
            return output.getvalue()
    except ValueError as e:
        print(f"Error cropping image, check dimensions: {e}")
        
async def merge_two_images(file_bytes1: bytes, file_bytes2: bytes,) -> bytes:
    try:
        with Image.open(BytesIO(file_bytes1)) as img1, Image.open(BytesIO(file_bytes2)) as img2:
            new_img = Image.new("RGB", (img1.width + img2.width, max(img1.height, img2.height)))
            new_img.paste(img1, (0, 0))
            new_img.paste(img2, (img1.width, 0))
            
            output = BytesIO()
            new_img.save(output, format="PNG")
            output.seek(0)
            return output.getvalue()
    except Exception as e:
        print(f"Error merging images: {e}")

async def transpose_image(file_bytes: bytes, target_format: str, angle: int = None, side: str = None) -> bytes:
    try:
        with Image.open(BytesIO(file_bytes)) as img:
            if angle:
                img = img.rotate(angle, expand=True)

            if side == "left":
                img = img.transpose(method=settings.image.transform_image["left"])
            elif side == "right":
                img = img.transpose(method=settings.image.transform_image["right"])
            elif side == "top":
                img = img.transpose(method=settings.image.transform_image["top"])
            elif side == "bottom":
                img = img.transpose(method=settings.image.transform_image["bottom"])
            elif side == "rotate_90":
                img = img.transpose(method=settings.image.transform_image["rotate_90"])
            elif side == "rotate_180":
                img = img.transpose(method=settings.image.transform_image["rotate_180"])
            elif side == "rotate_270":
                img = img.transpose(method=settings.image.transform_image["rotate_270"])
            output = BytesIO()
            img.save(output, format=target_format)
            output.seek(0)
            return output.getvalue()
    except Exception as e:
        print(f"Error transposing image: {e}")