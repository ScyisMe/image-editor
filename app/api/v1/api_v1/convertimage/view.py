from fastapi import APIRouter, File, UploadFile, Query
from fastapi.responses import StreamingResponse
from io import BytesIO
from app.services.image import convert_image, resize_image, decrease_image, get_image_info, cutting_image, merge_two_images, transpose_image
from app.config import settings
from typing import Literal

TransposeMethod = Literal["left", "right", "top", "bottom", "rotate_90", "rotate_180", "rotate_270"]

router = APIRouter(prefix="/image", tags=["Image"])

@router.post("/")
async def get_image(file: UploadFile = File(...)):
    file_bytes = await file.read()
    return StreamingResponse(BytesIO(file_bytes), media_type=file.content_type)

@router.post("/convert/type")
async def convert_image_endpoint(file: UploadFile = File(...), target_format: str = settings.image.allowed_formats["JPG"]):
    file_bytes = await file.read()
    convert_file = await convert_image(file_bytes, target_format)
    return StreamingResponse(BytesIO(convert_file), media_type=f"image/{target_format.lower()}")

@router.post("/convert/size")
async def convert_image_endpoint(file: UploadFile = File(...), target_format: str = settings.image.allowed_formats["JPG"], width: int = None, height: int = None):
    file_bytes = await file.read()
    convert_file = await resize_image(file_bytes, target_format, width=width, height=height)
    return StreamingResponse(BytesIO(convert_file), media_type=f"image/{target_format.lower()}")

@router.post("/convert/decrease")
async def decrease_image_endpoint(file: UploadFile = File(...), target_format: str = settings.image.allowed_formats["JPG"], width: int = None, height: int = None):
    file_bytes = await file.read()
    convert_file = await decrease_image(file_bytes, target_format, width=width, height=height)
    return StreamingResponse(BytesIO(convert_file), media_type=f"image/{target_format.lower()}")

@router.post("/convert/cut")
async def cutting_image_endpoint(file: UploadFile = File(...), target_format: str = settings.image.allowed_formats["JPG"], left: int = 0, upper: int = 0, right: int = 100, lower: int = 100):
    file_bytes = await file.read()
    cut_image = await cutting_image(file_bytes, target_format, left=left, upper=upper, right=right, lower=lower)
    return StreamingResponse(BytesIO(cut_image), media_type=f"image/{target_format.lower()}")

@router.post("/convert/merge")
async def merge_images_endpoint(file1: UploadFile = File(...), file2: UploadFile = File(...)):
    file_bytes1 = await file1.read()
    file_bytes2 = await file2.read()
    merged_image = await merge_two_images(file_bytes1, file_bytes2)
    return StreamingResponse(BytesIO(merged_image), media_type="image/PNG")

@router.post("/convert/transpose")
async def transpose_image_endpoint(file: UploadFile = File(...), target_format: str = settings.image.allowed_formats["JPG"], method: TransposeMethod = Query(...)):
    file_bytes = await file.read()
    transposed_image = await transpose_image(file_bytes, target_format, side=method)
    return StreamingResponse(BytesIO(transposed_image), media_type=f"image/{target_format.lower()}")

@router.post("/info")
async def image_info_endpoint(file: UploadFile = File(...)):
    file_bytes = await file.read()  
    info = await get_image_info(file_bytes)
    return info

