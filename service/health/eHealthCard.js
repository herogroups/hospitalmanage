
var soap = require('soap');
const util = require('../../Libs/util')
const eHealthNet = require('./eHealthNet')
const { pospLogger } = require('../../Libs/logger');
const config = require('../../conf/config')

class eHealthCard extends eHealthNet { 
 
  /**
   * 注册健康卡接口
   * 接口地址：https://p-healthopen.tengmed.com/rest/auth/HealthCard/HealthOpenPlatform/ISVOpenObj/registerHealthCard
   */
  async   registerHealthCard() {
    let req = {
      "wechatCode": "4D6FFFE544AE4CE1B5E5FA2DC1566E1C",
      "name": "张三",
      "gender": "男",
      "nation": "汉族",
      "birthday": "1998-09-08",
      "idNumber": "101102199809089988",
      "idType": "01",
      "address": "广东省深圳市南山区深南大道10000号",
      "phone1": "18808808808",
      "phone2": "",
      "patid": "1003243"
    }
    return await super.send('registerHealthCard', req)
  }
  /**
   * 通过健康卡授权码获取健康卡接口
   */
  async   getHealthCardByHealthCode() {
    let req = {
      "healthCode": "F9D3F8A308FC0EABC581F5903CAA1094"
    }
    return await super.send('getHealthCardByHealthCode', req)
  }

  /**
   * 通过健康卡二维码获取健康卡接口
   */
  async getHealthCardByQRCode() {

    let req = { "qrCodeText": "C7DA29345B6DF90A6F5BBEBD73EBE2EDA26F341A6CFEEEB121XXX:1" }
    return await super.send('getHealthCardByQRCode', req)
  }
  /**
   * 身份证照片OCR接口
   */
  async ocrInfo() {
    let req = {
      "imageContent": "base64"
    }
    return await super.send('ocrInfo', req)
  }
  /**
   * 绑定健康卡和院内ID关系接口
   */
  async bindCardRelation() {
    let req = {
      "patid": "1003243",
      "qrCodeText": "C220AE414CE6EE581037C311AE24518FCFE19C429BECD478C1A13976260FXXXX：1"
    }
    return await super.send('bindCardRelation',req)
  }
  /**
   * 用卡数据监测接口
   */
  async reportHISData() {
    let req = {
      "qrCodeText": "C220AE414CE6EE581037C311AE24518FCFE19C429BECD478C1A13976260FXXXX:1",
      "idCardNumber": "360782199001010101",
      "name": "张三",
      "time": "2018-10-02 16:36:57",
      "hospitalCode": "10086",
      "scene": "010101",
      "department": "0301",
      "cardType": "01",
      "cardChannel": "0401",
      "cardCostTypes": "0100"
    }
    return await super.send('reportHISData',req)
  }
  /**
   * 获取卡包订单ID接口
   */
  async getOrderIdByOutAppId() {
    let req = {
      "appId": "snzebh3x8zl4a4hi9",
      "qrCodeText": "2A4A19745AC6D6475C2AA48290B513F818F056277858104C89979A39E49D1444:1"
    }
    return await super.send('getOrderIdByOutAppId',req)
  }
  /**
   * 获取健康卡二维码接口
   */
  async getDynamicQRCode() {
    let req =
    {
      "healthCardId": "C220AE414CE6EE581037C311AE24518FCFE19C429BECD478C1A13976260FXXXX",
      "idType": "01",
      "idNumber": "432901198810228888"
    }
    return await super.send('getDynamicQRCode',req)
  }
  /**
   * 校验动态二维码接口
   */
  async verifyQRCode() {
    let req =
    {
      "qrCodeText": "D109C4C340995DFC13262A55699FBDAD8S564E8B65796FA1:0:B0E3CC5F50EF5DC663F094C985B58312::35020001001",
      "terminalId": "a12111134123",
      "time": "2018-11-29 16:10:33",
      "medicalStep": "010101",
      "channelCode": "0100",
      "useCityCode": "110000",
      "useCityName": "北京市",
      "hospitalCode": "01",
      "hospitalName": "人民医院",
      "orgId": "发卡机构",
      "name": "张三",
      "idCard": "100023200808081234",
      "useType": "01"
    }
    return await super.send('verifyQRCode',req)

  }
  /**
   * 注册人脸订单ID接口
   */
  async registerOrder() {
    let req =
    {
      "name": "王莎莎",
      "idCardNumber": "100023200808081234"
    }
    return await super.send('registerOrder',req)
  }
  /**
   * 校验人脸识别数据接口
   */
  async verifyFaceIdentity() {
    let req =
    {
      "orderId": "asdw123123ssdw2223",
      "verifyResult": "q5nEq59cwYby1R3lYFC1B683tIp8GKowZrLZ8rYPr/t2FN/YN66jXBa0lbUgv62Do1+kiqvfzB2kMsD4kpTRWdCYz840aTnLjmj3EBSfG02A0OhEedlKOYvsig9fio9wLqCepsQXT5/1yY1qWS4Ppwlyp3W4heB/H6ROdeCI48sYHbugBJKTm08g8GdMRlzVPglpQS4OdaZJ8N+nsk8NsOlGtru/gZhm6FK8aMLLIns="
    }
    return await super.send('verifyFaceIdentity',req)
  }



};
module.exports = eHealthCard;