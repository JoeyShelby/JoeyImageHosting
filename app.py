from flask import Flask, request, render_template, jsonify, send_from_directory

from config import UPLOAD_FOLDER
from show import list_files
from upload import upload_file

app = Flask(__name__)


# 返回文件夹里的文件内容，list
@app.route('/')
def hello_world():  # put application's code here
    files_info = list_files()
    return render_template('hello.html', files_info=files_info)


# 图片路径转化,通过如 /abc.jpg，直接访问到 UPLOAD_FOLDER 下的 filename
@app.route('/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# 跳转到文件上传页面
@app.route('/to_upload', methods=['GET', 'POST'])
def to_upload():
    return render_template('upload.html')


# 文件上传路由
@app.route('/upload', methods=['POST'])
def handle_upload():
    # 获取上传的文件
    file = request.files.get('file')

    # 调用上传处理函数
    result = upload_file(file)

    # 返回处理结果给前端
    return jsonify(result)


@app.route('/list_files', methods=['GET'])
def handle_list_files():
    # 调用列出文件的处理函数
    files_info = list_files()

    # 返回文件列表给前端
    return jsonify(files_info=[
        {'filename': file_info['filename'], 'size': file_info['size'], 'upload_date': file_info['upload_date']} for
        file_info in files_info])


@app.errorhandler(404)
def handler404(error):
    return render_template('hello.html'), 404


if __name__ == '__main__':
    app.run()
