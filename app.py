from flask import Flask, render_template, jsonify, send_from_directory

from config import UPLOAD_FOLDER
from show import list_files
from upload import upload_images

app = Flask(__name__, static_folder='static')


@app.route('/')
def hello_world():
    return render_template('index.html')


# 图片路径转化,通过如 /abc.jpg，直接访问到 UPLOAD_FOLDER 下的 filename
@app.route('/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# 上传文件接口
@app.route('/upload_images', methods=['POST'])
def handle_upload_images():
    return upload_images()


# 返回所有图片 JSON 数据
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
    return render_template('index.html'), 404


if __name__ == '__main__':
    app.run()
