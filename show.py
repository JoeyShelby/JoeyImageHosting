import os
from datetime import datetime

from config import UPLOAD_FOLDER


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

    return files_info
