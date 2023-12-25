from flask import request, jsonify
import os

from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS


# 检验文件上传类型是否合规
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_images():
    try:
        # 检查是否有 'images' 字段在请求中
        if 'images' not in request.files:
            return jsonify({'error': 'No images provided'}), 400

        images = request.files.getlist('images')

        # 保存上传的文件
        for image in images:
            # 检查文件类型是否合规
            if allowed_file(image.filename):
                image.save(os.path.join(UPLOAD_FOLDER, image.filename))
            else:
                return jsonify({'error': 'Invalid file type'}), 400

        return jsonify({'message': 'Files uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500