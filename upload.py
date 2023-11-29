import os

from config import UPLOAD_FOLDER, ALLOWED_EXTENSIONS


# 检验文件上传类型是否合规
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def upload_file(file):
    # 检查是否有文件被上传
    if not file:
        return {'error': 'No file part'}

    # 如果用户未选择文件，浏览器也会提交一个空的文件字段
    if file.filename == '':
        return {'error': 'No selected file ro FileName is NULL'}

    # 检查文件类型是否允许
    if allowed_file(file.filename):
        # 生成文件保存路径
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)

        # 保存文件
        file.save(file_path)

        # 返回成功响应
        return {'message': 'File successfully uploaded', 'file_path': file_path}

    else:
        return {'error': 'Invalid file type'}


