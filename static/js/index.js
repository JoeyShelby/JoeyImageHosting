        // 从后端获取 JSON 数据
        fetch('/list_files')
            .then(response => response.json())
            .then(data => {
                // 打印获取到的 JSON 数据
                console.log('JSON data:', data);

                // 调用渲染函数
                renderFileList(data.files_info);
            })
            .catch(error => console.error('Error fetching data:', error));


        // 渲染文件列表
        function renderFileList(filesInfo) {
            const fileListContainer = document.getElementById('fileList');

            if (!filesInfo || !Array.isArray(filesInfo)) {
                console.error('Invalid data format');
                return;
            }

            // 按日期分组的逻辑
            const filesByDate = {};
            filesInfo.forEach(fileInfo => {
                const date = fileInfo.upload_date;
                if (!filesByDate[date]) {
                    filesByDate[date] = [];
                }
                filesByDate[date].push(fileInfo);
            });

            console.log(filesByDate)

            // 清空容器
            fileListContainer.innerHTML = '';

            // 遍历日期分组
            Object.keys(filesByDate).forEach(date => {
                const fileGroup = document.createElement('div');
                fileGroup.classList.add('file-group');

                // 添加日期标题
                const dateHeader = document.createElement('h2');
                dateHeader.textContent = date;
                fileGroup.appendChild(dateHeader);

                // 创建横向容器，横向显示每个日期分组内的图片
                const horizontalContainer = document.createElement('div');
                horizontalContainer.classList.add('horizontal-container');
                fileGroup.appendChild(horizontalContainer);

                // 遍历日期内的文件
                filesByDate[date].forEach(fileInfo => {
                    const fileBox = document.createElement('div');
                    fileBox.classList.add('file-box');

                    // 在控件上添加悬停效果
                    fileBox.addEventListener('mouseover', () => showFileInfo(fileInfo));

                    // 在控件上添加点击事件，将文件的url保存到剪贴板
                    fileBox.addEventListener('click', () => copyToClipboard(getWebsitePath() + fileInfo.filename));

                    // 创建图片元素
                    const imgElement = document.createElement('img');
                    imgElement.src = getWebsitePath() + fileInfo.filename;
                    imgElement.alt = fileInfo.filename; // 添加图片的替代文本
                    imgElement.style.width = '100%'; // 使图片充满整个容器

                    const fileInfoElement = document.createElement('div');
                    fileInfoElement.classList.add('file-info');
                    fileInfoElement.textContent = `${fileInfo.filename}\n${fileInfo.size}`;

                    fileBox.appendChild(imgElement);
                    fileBox.appendChild(fileInfoElement);
                    horizontalContainer.appendChild(fileBox);
                });

                fileListContainer.prepend(fileGroup);
            });
        }

        // 显示文件信息
        function showFileInfo(fileInfo) {
            console.log(`File: ${fileInfo.filename}, Size: ${fileInfo.size}, Upload Date: ${fileInfo.upload_date}`);
        }

        // 获取当前页面的网站路径
        function getWebsitePath() {
            // 获取当前页面的完整 URL
            const currentUrl = window.location.href;

            // 提取网站路径部分
            const pathArray = currentUrl.split('/');
            return pathArray[0] + '//' + pathArray[2] + '/';
        }

        // 复制文件名到剪贴板
        function copyToClipboard(filename) {
            const clipboard = new ClipboardJS('.file-box', {
                text: function() {
                    return filename;
                }
            });

            clipboard.on('success', function(e) {
                console.log(`Copied to clipboard: ${e.text}`);
                clipboard.destroy();
            });

            clipboard.on('error', function(e) {
                console.error('Unable to copy to clipboard', e);
                clipboard.destroy();
            });

            clipboard.onClick({ trigger: true });
        }

          // 模态框操作
        function openModal() {
            // 清空待上传区
            document.getElementById('uploadedImgs').innerHTML = "";
            document.getElementById('myModal').style.display = 'block';
        }

        function closeModal() {
            document.getElementById('myModal').style.display = 'none';
        }

        // 在脚本中添加以下函数
        function openFilePicker() {
            document.getElementById('fileInput').click();
        }

        // 待上传区
        let selectedImgs = [];
        // 在脚本中修改 handleFileSelect 函数
        function handleFileSelect() {
            const fileInput = document.getElementById('fileInput');
            // 添加到待上传数组
            selectedImgs.push(...fileInput.files)
            // 渲染
            renderSelectedImgs();

            console.log("本次选择：", fileInput.files)
        }


        // 给模态框加上拖拽上传文件的功能
        document.getElementById('myModal').addEventListener('dragover', allowDrop);
        document.getElementById('myModal').addEventListener('drop', function(event) {
            allowDrop(event);
            handleDrop(event);
        });
        function allowDrop(event) {
            event.preventDefault();
        }
        function handleDrop(event) {
            event.preventDefault();

            const dt = event.dataTransfer;
            const files = dt.files;

            // 过滤允许上传的文件格式
            const allowedFormats = ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp", "ico"];
            const validFiles = Array.from(files).filter(file => {
                const extension = getFileExtension(file.name);
                return allowedFormats.includes(extension.toLowerCase());
            });

            console.log("本次拖拽文件:", files);
            console.log("有效文件:", validFiles);

            // 添加符合条件的文件到selectedImgs数组
            selectedImgs.push(...validFiles);

            // 渲染待上传区的图片
            renderSelectedImgs();
        }

        // 获取文件扩展名的辅助函数
        function getFileExtension(filename) {
            const extension = filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
            console.log("文件扩展名:", extension);
            return extension;
        }

        // 去除待上传区文件名重复的图片
        function removeDuplicates() {
            // 利用 Map 去重
            const tempMap = new Map();
            selectedImgs.forEach(file => {
                tempMap.set(file.name, file);
            })

            selectedImgs = Array.from(tempMap.values())
        }

        // 渲染待上传区的图片
        function renderSelectedImgs() {
            const uploadedImgs = document.getElementById('uploadedImgs');
            uploadedImgs.innerHTML = "";

            // 待上传图片去重
            removeDuplicates();
            console.log("renderSelectedImgs", selectedImgs);

             // 遍历用户选择的文件并创建图像元素显示
            for (const file of selectedImgs) {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('uploaded-img-container');

                const imgElement = document.createElement('img');
                imgElement.src = URL.createObjectURL(file);
                imgElement.alt = file.name;
                imgElement.style.width = '100px';
                imgElement.style.marginRight = '10px';

                // 创建删除按钮
                const deleteButton = document.createElement('span');
                deleteButton.textContent = 'x';
                deleteButton.classList.add('delete-button');

                // 添加单击事件，调用删除函数
                deleteButton.addEventListener('click', () => deleteImage(imgContainer, file));

                // 将删除按钮添加到图像元素中
                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(deleteButton);

                uploadedImgs.appendChild(imgContainer);
            }
        }

        function deleteImage(imgElement) {
            // 从 DOM 中移除图像元素
            imgElement.parentNode.removeChild(imgElement);

            // 在 selectedImgs 数组中找到并移除相应的文件
            const index = selectedImgs.indexOf(imgElement.file);
            if (index !== -1) {
                selectedImgs.splice(index, 1);
            }

        }

       // 点击上传按钮触发图片上传
        async function uploadFiles() {
            const fileInput = document.getElementById('fileInput');

            // 检查是否有文件需要上传
            if (selectedImgs.length > 0) {
                try {
                    // 使用 FormData 构建表单数据
                    const formData = new FormData();
                    selectedImgs.forEach(file => {
                        formData.append('images', file);
                    });

                    // 使用 Fetch API 发送文件到后端
                    const response = await fetch('/upload_images', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        console.log('Files uploaded successfully!');
                        // 清空选择的文件，避免文件重复选择时无法触发 onchange 事件
                        fileInput.value = null;
                        // 上传完成，关闭模态框，重新加载页面
                        closeModal();
                        location.reload();
                        // 上传完成后，清空待上传数组，重新渲染待上传区
                        selectedImgs = [];
                        renderSelectedImgs();
                    } else {
                        console.error('File upload failed.');
                    }
                } catch (error) {
                    console.error('Error uploading files:', error);
                }
            }
        }