export default {
  /**
   * 发起接入请求
   * @param  {Number} productId  需要接入产品 id
   * @param  {[Object]} data     需要传递的用户信息
   */
  request(productId, data) {
    const form = document.createElement('form');
    form.id = 'form';
    form.name = 'form';
    document.body.appendChild(form);

    // 设置相应参数
    for (let key in data) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = key;
      input.value = data[key];
      // 将该输入框插入到 form 中
      form.appendChild(input);
    }
    // form 的提交方式
    form.method = 'POST';
    // form 提交路径
    form.action = 'https://support.qq.com/product/' + productId;
    // 对该 form 执行提交
    form.submit();
    // 删除该 form
    document.body.removeChild(form);
  }
};
