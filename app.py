import os

from config import UPLOAD_FOLDER
from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
from datetime import datetime


app = Flask(__name__)


# 返回文件夹里的文件内容，list
@app.route('/')
def hello_world():  # put application's code here
    files_info = list_files()
    return render_template('hello.html', files_info=files_info)


# 跳转到文件上传页面
@app.route('/to_upload', methods=['GET', 'POST'])
def to_upload():
    return render_template('upload.html')


# 文件上传
@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'

    file = request.files['file']

    if file.filename == '':
        return 'No selected file'
    # 文件保存到指定路径
    file.save(f'{UPLOAD_FOLDER}/{secure_filename(file.filename)}')
    return 'File uploaded successfully'


# 返回整个文件夹下的文件信息
@app.route('/list_files', methods=['GET'])
def list_files():
    files_info = []

    for filename in os.listdir(f'{UPLOAD_FOLDER}/'):
        file_path = os.path.join(F'{UPLOAD_FOLDER}/', filename)
        file_stat = os.stat(file_path)

        file_info = {
            'filename': filename,
            'size': f'{file_stat.st_size / 1000} KB',  # 文件大小，以字节为单位
            'upload_date': datetime.fromtimestamp(file_stat.st_mtime).strftime('%Y%m%d')  # 文件上传日期（最后修改时间），以秒为单位
        }

        files_info.append(file_info)

    # 按日期降序排列
    files_info = sorted(files_info, key=lambda x: datetime.strptime(x['upload_date'], '%Y%m%d'), reverse=True)

    # 转换为 JSON 格式
    json_data = jsonify(files_info=[
        {'filename': file_info['filename'], 'size': file_info['size'], 'upload_date': file_info['upload_date']} for
        file_info in files_info])

    return json_data


@app.errorhandler(404)
def handler404(error):
    return render_template('hello.html'), 404


if __name__ == '__main__':
    app.run()
