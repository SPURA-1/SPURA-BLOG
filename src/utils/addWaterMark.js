// src/utils/watermark.js

/**
 * 给图片文件添加水印
 * @param {File} file - 原始图片文件
 * @param {Object} [options] - 水印配置选项
 * @param {string} [options.text='© SPURA-Blog Yyyy'] - 水印文字
 * @param {string} [options.font='24px Arial'] - 字体设置
 * @param {string} [options.textColor='rgba(135, 206, 250, 0.65)'] - 文字颜色
 * @param {string} [options.bgColor='rgba(0, 0, 0, 0.3)'] - 背景框颜色
 * @param {string} [options.position='bottom-right'] - 水印位置 (bottom-right, top-left, center)
 * @param {number} [options.padding=20] - 内边距
 * @returns {Promise<File>} 添加水印后的文件
 */
export function addWatermark(file, options = {}) {
  // 合并默认选项和用户选项
  const {
    text = '© SPURA-Blog Yyyy',
    font = '24px Arial',
    textColor = 'rgba(135, 206, 250, 0.65)',
    bgColor = 'rgba(0, 0, 0, 0.3)',
    position = 'bottom-right',
    padding = 20
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置画布尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 绘制原始图片
        ctx.drawImage(img, 0, 0);

        // 设置水印样式
        ctx.font = font;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        // 计算水印位置
        let x, y;
        const textWidth = ctx.measureText(text).width;
        
        switch(position) {
          case 'top-left':
            x = padding + textWidth;
            y = padding + 20;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            break;
          case 'center':
            x = canvas.width / 2;
            y = canvas.height / 2;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            break;
          default: // bottom-right
            x = canvas.width - padding;
            y = canvas.height - padding;
        }

        // 绘制背景框 (仅对右下角位置)
        if (position === 'bottom-right') {
          ctx.fillStyle = bgColor;
          ctx.fillRect(
            canvas.width - textWidth - padding * 2,
            canvas.height - 40,
            textWidth + padding * 2,
            30
          );
        }

        // 绘制水印文字
        ctx.fillStyle = textColor;
        ctx.fillText(text, x, y);

        // 转换为文件对象
        canvas.toBlob(blob => {
          const watermarkedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(watermarkedFile);
        }, file.type);
      };

      img.onerror = (err) => reject(new Error('图片加载失败', { cause: err }));
      img.src = e.target.result;
    };

    reader.onerror = (err) => reject(new Error('文件读取失败', { cause: err }));
    reader.readAsDataURL(file);
  });
}