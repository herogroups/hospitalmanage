class ResultBean{
    constructor(code,msg='')
    {
        this.code=code
        this.msg =msg;
    }
    setStatus(code,msg)
    {
        this.code=code
        this.msg =msg;
    }
}
module.exports = ResultBean; 