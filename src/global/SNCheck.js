function checkSeriaList(that, Data) {
  var flag = 1
  var Message = ''
  var reg = /^(([A-Za-z0-9]{2}[0-9]{6})|([A-Za-z0-9]{3}[0-9]{7})|([A-Za-z0-9]{10}[0-9]{6})|([A-Za-z0-9]{11}[0-9]{7}))$/
  var strTemp = Data.split(',')
  for (var i = 0; i < strTemp.length; i++) {
    var Arr = strTemp[i].split('-')
    for (var j = 0; j < Arr.length; j++) {
      if (Arr[j].length != 8 && Arr[j].length != 9 && Arr[j].length != 10 && Arr[j].length != 16 && Arr[j].length != 18) {
        Message += 'Sequence length cannot be:' + Arr[j].length + '  (' + Arr[j] + ')\n'
        flag = 0
        continue
      }
      Arr[j] = Arr[j].replace(/\n/g, '')
      if (!reg.test(Arr[j])) {
        Message += 'Sequence Number does not conform to the rule:' + Arr[j] + '\n'
        flag = 0
      }
    }
  }
  if (flag == 0) {
    altMessage(that, Message)
    return false
  }
  return true
}

function FormatCheck(that, inputStr)// 输入格式检查
{
  var ResultSnlist = ''
  inputStr = inputStr.replace(/，/g, ',')
  if (inputStr.trim().indexOf('GS') >= 0) {
    var arr = inputStr.split('[)>')
    var beforSnList = ''
    if (arr.length > 1) {
      if (trim(arr[0]) !== '') {
        beforSnList = arr[0]

        if (beforSnList.substring(beforSnList.length - 1, beforSnList.length) === ',') {
          beforSnList = beforSnList.substring(0, beforSnList.length - 1)
        } else {
          beforSnList = arr[0]
        }
      } else inputStr = arr[1]
    } else { inputStr = arr[0] }

    if (trim(beforSnList) != '') {
      ResultSnlist += beforSnList
    }

    var strSn = inputStr.split('{RS}{Eot}')

    for (var i = 0; i < strSn.length; i++) {
      var tempstr = strSn[i].split('{GS}')
      for (var j = 2; j < tempstr.length; j++) {
        if (ResultSnlist != '') {
          ResultSnlist += ','
        }
        ResultSnlist += tempstr[j]
      }
      if (i != strSn.length - 1 && trim(strSn[i + 1]) != '') {
        ResultSnlist += ','
      }
    }
  } else {
    if (inputStr.substring(inputStr.length - 1, inputStr.length) == ',') {
      inputStr = inputStr.substring(0, inputStr.length - 1)
    }
    // inputStr = inputStr.replace(/\n/g, "");

    if (!checkSeriaList(that, inputStr)) {
      return ResultSnlist
    }
    ResultSnlist = inputStr
  }

  ResultSnlist = GetSerialListLetter(ResultSnlist)

  return ResultSnlist
}
// 拆分序列号用SN,SN,...连起来(支持8位和10位字符的SN)
function GetSerialListLetter(Data) {
  var SerialNumberList = Data.split(',')
  var a = new Array()
  for (var i = 0; i < SerialNumberList.length; i++) {
    var SerialNumber = SerialNumberList[i].trim().split('-')
    switch (SerialNumber.length) {
      case 1:
        a.push(SerialNumber[0])
        break
      case 2:

        var fscode = ''
        var Id_Start = 0
        var Id_End = 0
        var SNLength = 0
        if (trim(SerialNumber[0]).length == 8)// 8位SN
        { SNLength = 6 } else if (trim(SerialNumber[0]).length == 10)// 10位SN
        { SNLength = 7 } else if (trim(SerialNumber[0]).length == 16)// 16位SN
        { SNLength = 6 } else if (trim(SerialNumber[0]).length == 18)// 18位SN
        { SNLength = 7 } else if (trim(SerialNumber[0]).length == 9)// 9位SN
        { SNLength = 7 }

        var PreLength = trim(SerialNumber[0]).length - SNLength
        fscode = SerialNumber[0].substring(0, PreLength)

        Id_Start = parseInt(trim(SerialNumber[0]).substring(PreLength, trim(SerialNumber[0]).length - PreLength + PreLength))
        Id_End = parseInt(trim(SerialNumber[1]).substring(PreLength, trim(SerialNumber[1]).length - PreLength + PreLength))
        if (Id_Start > Id_End) {
          var temp = Id_Start
          Id_Start = Id_End
          Id_End = temp
        }
        for (var j = Id_Start; j <= Id_End; j++) {
          var temp = Id_Start.toString().substring(0, Id_Start.toString().PadLeft(SNLength, '0').length - j.toString().PadLeft(SNLength, '0').length) + j
          a.push(fscode + temp.PadLeft(SNLength, '0'))
        }

        break
    }
  }
  var strid = ''

  a = RemoveSame(a)

  for (var i = 0; i < a.length; i++) {
    if (trim(strid) != '' && a[i] != '') { strid += ',' }
    strid += a[i]
  }

  return strid
}

// 合并序列号，支持8位和10位
function MergeSerialListLetter(Serial) {
  var List = ''
  try {
    if (Serial != '') {
      if (Serial.indexOf(',') == 0) { Serial = Serial.substring(1, Serial.length - 1) }

      var a = Serial.split(',')
      a.sort()

      var b = new Array()
      // 获取机型码
      for (var i = 0; i < a.length; i++) {
        var fscode = ''
        if (trim(a[i].toString()).length == 8) { fscode = trim(a[i].toString()).substring(0, 2) } else if (trim(a[i].toString()).length == 10) { fscode = trim(a[i].toString()).substring(0, 3) } else if (trim(a[i].toString()).length == 16) { fscode = trim(a[i].toString()).substring(0, 10) } else if (trim(a[i].toString()).length == 18) { fscode = trim(a[i].toString()).substring(0, 11) }
        b.push(fscode)
      }
      // 移除相同的机型码
      if (b.length != 1) { b = RemoveSame(b) }

      // 把相同机型码进行合并处理
      for (var z = 0; z < b.length; z++) {
        var fcode = b[z].toString()
        var c = new Array()
        for (var i = 0; i < a.length; i++) {
          var fscodeItem = ''
          if (trim(a[i].toString()).length == 8) { fscodeItem = trim(a[i].toString()).substring(0, 2) } else if (trim(a[i].toString()).length == 10) { fscodeItem = trim(a[i].toString()).substring(0, 3) } else if (trim(a[i].toString()).length == 16) { fscodeItem = trim(a[i].toString()).substring(0, 10) } else if (trim(a[i].toString()).length == 18) { fscodeItem = trim(a[i].toString()).substring(0, 11) }

          if (fscodeItem == fcode) { c.push(a[i].toString()) }
        }
        if (List != '') {
          List += ','
        }
        List += MergeSerialListLetterOldArrayList(c)
      }
    }
  } catch (Exception) {
    List = ''
  }

  return List
}
function MergeSerialListLetterOldArrayList(a) {
  var List = ''
  try {
    if (a.length > 0) {
      a.sort()
      List = trim(a[0].toString())

      var SNLength = 0
      if (trim(a[0].toString()).length == 8) { SNLength = 6 } else if (trim(a[0].toString()).length == 10) { SNLength = 7 } else if (trim(a[0].toString()).length == 16) { SNLength = 6 } else if (trim(a[0].toString()).length == 18) { SNLength = 7 }

      var PreLength = trim(a[0].toString()).length - SNLength
      var fscode = trim(a[0].toString()).substring(0, PreLength)
      var regCode = '/' + fscode + '/'
      var aa = parseInt(trim(a[0].toString()).substring(PreLength, trim(a[0].toString()).length))

      var f = parseInt(a[0].toString().replace(new RegExp(regCode), ''))
      var l = parseInt(a[a.length - 1].toString().replace(new RegExp(regCode), ''))
      if ((l - f + 1) == a.length && a.length != 1)// 如果是连续的序列号就不进行合并直接取首尾
      {
        List = a[0].toString() + '-' + a[a.length - 1].toString()
      } else {
        // #region 合并序列号
        for (var i = 0; i < a.length; i++) {
          if (i < a.length - 1) {
            var bb = 0
            if (trim(a[i + 1].toString()).length == 8) {
              bb = parseInt(trim(a[i + 1].toString()).substring(2, trim(a[i + 1].toString()).length))
            } else if (trim(a[i + 1].toString()).length == 10) {
              bb = parseInt(trim(a[i + 1].toString()).substring(3, trim(a[i + 1].toString()).length))
            } else if (trim(a[i + 1].toString()).length == 16) {
              bb = parseInt(trim(a[i + 1].toString()).substring(10, trim(a[i + 1].toString()).length))
            } else if (trim(a[i + 1].toString()).length == 18) {
              bb = parseInt(trim(a[i + 1].toString()).substring(11, trim(a[i + 1].toString()).length))
            }
            if ((bb - aa) == 1) {
              aa = bb
            } else {
              if (List.replace(new RegExp(regCode), '').indexOf(aa.toString()) > -1 || aa == bb) {
                List += ',' + fscode + bb.toString().PadLeft(SNLength, '0')
              } else {
                List += '-' + fscode + aa.toString().PadLeft(SNLength, '0') + ',' + fscode + bb.toString().PadLeft(SNLength, '0')
              }
              aa = bb
            }
          } else {
            if (List.indexOf(trim(a[i].toString())) == -1) {
              List += '-' + trim(a[i].toString()).toString().PadLeft(SNLength, '0')
            }
          }
        }
        //  #endregion
      }
    }
  } catch (Exception) {
    List = ''
  }

  return List
}

function RemoveSame(list) {
  var listCount = list.length
  for (var i = 0; i < list.length; i++) {
    for (var j = i + 1; j < list.length; j++) {
      if (list[i] == list[j]) {
        list.splice(j, 1)
        j--
      }
    }
  }
  return list
}

function FillZero(p) {
  return new Array(3 - (p + '').length + 1).join('0') + p
}

// 方法一扩展（C#中PadLeft、PadRight）
String.prototype.PadLeft = function(len, charStr) {
  var s = this + ''
  if (s.length > len) { return s } else { return new Array(len - s.length + 1).join(charStr, '') + s }
}
String.prototype.PadRight = function(len, charStr) {
  var s = this + ''
  if (s.length > len) { return s } else { return s + new Array(len - s.length + 1).join(charStr, '') }
}
function trim(str) { // 删除左右两端的空格
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

// 合并CSN
function MergeCSNArrayList(a) {
  var List = ''
  try {
    if (a.length > 0) {
      a.sort()
      List = trim(a[0].toString())
      var SNTemp = a[0].replace(/\D/g, ',')
      var ArrTemp = SNTemp.split(',')
      var SNLength = ArrTemp[ArrTemp.length - 1].length

      var PreLength = trim(a[0].toString()).length - SNLength
      var fscode = trim(a[0].toString()).substring(0, PreLength)
      var regCode = '/' + fscode + '/'
      var aa = parseInt(trim(a[0].toString()).substring(PreLength, trim(a[0].toString()).length))

      var f = parseInt(a[0].toString().replace(new RegExp(regCode), ''))
      var l = parseInt(a[a.length - 1].toString().replace(new RegExp(regCode), ''))
      if ((l - f + 1) == a.length && a.length != 1)// 如果是连续的序列号就不进行合并直接取首尾
      {
        List = a[0].toString() + '-' + a[a.length - 1].toString()
      } else {
        // #region 合并序列号
        for (var i = 0; i < a.length; i++) {
          if (i < a.length - 1) {
            var bb = 0
            bb = parseInt(trim(a[i + 1].toString()).substring(a[i + 1].toString().length - SNLength, trim(a[i + 1].toString()).length))

            if ((bb - aa) == 1) {
              aa = bb
            } else {
              if (List.replace(new RegExp(regCode), '').indexOf(aa.toString()) > -1 || aa == bb) {
                List += ',' + fscode + bb.toString().PadLeft(SNLength, '0')
              } else {
                List += '-' + fscode + aa.toString().PadLeft(SNLength, '0') + ',' + fscode + bb.toString().PadLeft(SNLength, '0')
              }
              aa = bb
            }
          } else {
            if (List.indexOf(trim(a[i].toString())) == -1) {
              List += '-' + trim(a[i].toString()).toString().PadLeft(SNLength, '0')
            }
          }
        }
        //  #endregion
      }
    }
  } catch (Exception) {
    List = ''
  }

  return List
}

function MergeCSNLetter(Serial) {
  var List = ''
  try {
    if (Serial != '') {
      if (Serial.indexOf(',') == 0) { Serial = Serial.substring(1, Serial.length - 1) }

      var a = Serial.split(',')
      a.sort()

      var b = new Array()
      var SNTemp = a[0].replace(/\D/g, ',')
      var ArrTemp = SNTemp.split(',')

      var SNLength = ArrTemp[ArrTemp.length - 1].length

      // 获取机型码
      for (var i = 0; i < a.length; i++) {
        var tem = a[i].toString().length
        var fscode = trim(a[i].toString()).substring(0, a[i].toString().length - SNLength)
        b.push(fscode)
      }
      // 移除相同的机型码
      if (b.length != 1) { b = RemoveSame(b) }

      // 把相同机型码进行合并处理
      for (var z = 0; z < b.length; z++) {
        var fcode = b[z].toString()
        var c = new Array()
        for (var i = 0; i < a.length; i++) {
          var fscodeItem = trim(a[i].toString()).substring(0, a[i].toString().length - SNLength)

          if (fscodeItem == fcode) { c.push(a[i].toString()) }
        }
        if (List != '') {
          List += ','
        }
        List += MergeCSNArrayList(c)
      }
    }
  } catch (Exception) {
    List = ''
  }

  return List
}

// 拆分CSN
function GetCSNLetter(Data) {
  var SerialNumberList = Data.split(',')
  var a = new Array()
  for (var i = 0; i < SerialNumberList.length; i++) {
    var SerialNumber = SerialNumberList[i].trim().split('-')
    switch (SerialNumber.length) {
      case 1:
        a.push(SerialNumber[0])
        break
      case 2:

        var fscode = ''
        var Id_Start = 0
        var Id_End = 0
        var SNTemp = SerialNumber[0].replace(/\D/g, ',')
        var ArrTemp = SNTemp.split(',')

        var SNLength = ArrTemp[ArrTemp.length - 1].length

        if (SerialNumber[0].length == SerialNumber[1].length) {
          var PreLength = trim(SerialNumber[0]).length - SNLength
          fscode = SerialNumber[0].substring(0, PreLength)
          Id_Start = parseInt(trim(SerialNumber[0]).substring(PreLength, trim(SerialNumber[0]).length - PreLength + PreLength))
          Id_End = parseInt(trim(SerialNumber[1]).substring(PreLength, trim(SerialNumber[1]).length - PreLength + PreLength))
          if (Id_Start > Id_End) {
            var temp = Id_Start
            Id_Start = Id_End
            Id_End = temp
          }
          for (var j = Id_Start; j <= Id_End; j++) {
            var temp = Id_Start.toString().substring(0, Id_Start.toString().PadLeft(SNLength, '0').length - j.toString().PadLeft(SNLength, '0').length) + j
            a.push(fscode + temp.PadLeft(SNLength, '0'))
          }
        } else {
          a.push(SerialNumber[0])
          a.push(SerialNumber[1])
        }
        break
    }
  }
  var strid = ''

  a = RemoveSame(a)

  for (var i = 0; i < a.length; i++) {
    if (trim(strid) != '' && a[i] != '') { strid += ',' }
    strid += a[i]
  }

  return strid
}

function FormatCheckCSN(that, inputStr)// 输入格式检查
{
  var ResultSnlist = ''
  inputStr = inputStr.replace(/，/g, ',')
  if (inputStr.trim().indexOf('GS') >= 0) {
    var arr = inputStr.split('[)>')
    var beforSnList = ''
    if (arr.length > 1) {
      if (trim(arr[0]) != '') {
        beforSnList = arr[0]

        if (beforSnList.substring(beforSnList.length - 1, beforSnList.length) == ',') {
          beforSnList = beforSnList.substring(0, beforSnList.length - 1)
        } else {
          beforSnList = arr[0]
        }
      } else inputStr = arr[1]
    } else { inputStr = arr[0] }

    if (trim(beforSnList) != '') {
      ResultSnlist += beforSnList
    }

    var strSn = inputStr.split('{RS}{Eot}')

    for (var i = 0; i < strSn.length; i++) {
      var tempstr = strSn[i].split('{GS}')
      for (var j = 2; j < tempstr.length; j++) {
        if (ResultSnlist != '') {
          ResultSnlist += ','
        }
        ResultSnlist += tempstr[j]
      }
      if (i != strSn.length - 1 && trim(strSn[i + 1]) != '') {
        ResultSnlist += ','
      }
    }
  } else {
    if (inputStr.substring(inputStr.length - 1, inputStr.length) == ',') {
      inputStr = inputStr.substring(0, inputStr.length - 1)
    }
    // inputStr = inputStr.replace(/\n/g, "");

    if (!checkCSN(that, inputStr)) {
      return ResultSnlist
    }
    ResultSnlist = inputStr
  }

  ResultSnlist = GetCSNLetter(ResultSnlist)

  return ResultSnlist
}

function checkCSN(that, Data) {
  var flag = 1
  var Message = ''
  var reg = /^([0-9]{3})$/
  var reg1 = /^[a-zA-Z0-9]{1,}$/
  var strTemp = Data.split(',')
  for (var i = 0; i < strTemp.length; i++) {
    var Arr = strTemp[i].split('-')
    for (var j = 0; j < Arr.length; j++) {
      // if (Arr[j].length < 8) {
      //    Message += "Sequence length cannot be:" + Arr[j].length + "  (" + Arr[j] + ")\n";
      //    flag = 0;
      //    continue;
      // }
      Arr[j] = Arr[j].replace(/\n/g, '')
      var aa = Arr[j].toString().substring(Arr[j].toString().length - 3, Arr[j].toString().length)
      if (!reg.test(aa) || !reg1.test(aa)) {
        Message += 'Sequence Number does not conform to the rule:' + Arr[j] + '\n'
        flag = 0
      }
    }
  }
  if (flag == 0) {
    altMessage(that, Message)
    return false
  }
  return true
}

// 文本域校验时的提示信息
function altMessage(that, message) {
  that.$message.error({
    message: message,
    duration: 1500
  })
}

export default {
  checkSeriaList,
  FormatCheck,
  GetSerialListLetter,
  MergeSerialListLetter,
  MergeSerialListLetterOldArrayList,
  RemoveSame,
  FillZero,
  MergeCSNArrayList,
  MergeCSNLetter,
  GetCSNLetter,
  FormatCheckCSN,
  checkCSN
}
