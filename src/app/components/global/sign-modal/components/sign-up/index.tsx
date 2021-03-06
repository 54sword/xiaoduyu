import React, { useState, createRef } from 'react';

// tools
import Device from '@app/common/device';

// redux
import { useStore } from 'react-redux';
import { signIn, signUp } from '@app/redux/actions/sign';

// components
import CaptchaButton from '@app/components/captcha-button';
import CountriesSelect from '@app/components/countries-select';

// styles
import './styles/index.scss';

export default function () {

  const account = createRef();
  const nickname = createRef();
  const password = createRef();
  const male = createRef();
  const female = createRef();
  const captcha = createRef();

  const [ areaCode, setAreaCode ] = useState('');
  const [ type, setType ] = useState('phone');

  const store = useStore();
  const _signUp = (args:any)=>signUp(args)(store.dispatch, store.getState);
  const _signIn = (args:any)=>signIn(args)(store.dispatch, store.getState);

  const submit = function(event: any, test = false) {

    if (event) event.preventDefault();

    return new Promise(async (resolve, reject)=>{

      const $account = account.current;
      const $nickname = nickname.current;
      const $password = password.current;
      const $male = male.current;
      const $female = female.current;
      const $captcha = captcha.current;      

      if (!$nickname.value) return $nickname.focus();
      if (!$account.value) return $account.focus();
      if (!$captcha.value) return $captcha.focus();
      if (!$password.value) return $password.focus();
      if (!$male.checked && !$female.checked) {
        $.toast({
          text: '请选择性别',
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'warning',
          loader: false,
          allowToastClose: false
        });
        return;
      }

      let data: any = {
        nickname: $nickname.value,
        password: $password.value,
        gender: $male.checked ? 1 : 0,
        source: parseInt(Device.getCurrentDeviceId()),
        captcha: $captcha.value
      }
      
      if (type == 'email') {
        data.email = $account.value
      } else {

        if (!areaCode) {
          $.toast({
            text: '请选择手机区号',
            position: 'top-center',
            showHideTransition: 'slide',
            icon: 'warning',
            loader: false,
            allowToastClose: false
          });
          return;
        }

        data.phone = $account.value
        data.area_code = areaCode
      }

      let err: any, res: any;
      let result: any = await _signUp(data);

      [ err, res ] = result;

      if (err) {
        $.toast({
          text: err && err.message ? err.message : err,
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'error',
          loader: false,
          allowToastClose: false
        });
        if (test) reject(err);
        return;
      } else {
        
        $.toast({
          text: '注册成功',
          position: 'top-center',
          showHideTransition: 'slide',
          icon: 'success',
          loader: false,
          allowToastClose: false
        });

        if (location.search == '?from=google-ads' && gtag) {
          // google 注册转化统计
          // Event snippet for 注册账号 conversion page
          gtag('event', 'conversion', {
              'send_to': 'AW-985399355/PIC-CKeirq4BELuA8NUD',
              'value': 1.0,
              'currency': 'CNY'
          });
        }

        if (test) resolve(err);
      }
      
      // 登陆
      delete data.nickname;
      delete data.gender;
      delete data.source;
      delete data.captcha;
      delete data.area_code;

      _signIn({ data })
      .then((res: any)=>{
      })
      .catch((res: any)=>{
        $('#sign').modal('hide');
        setTimeout(()=>{
          $('#sign').modal({ show: true }, { 'data-type': 'sign-in' });
        }, 700);
      });

    })

  }

  const sendCaptcha = function(callback: any) {

    const $account = account.current;

    if (!$account.value) {
      return $account.focus();
    }

    let params: any = { type: 'sign-up' }

    if (type == 'email') {
      params.email = $account.value;
    } else {
      params.area_code = areaCode;
      params.phone = $account.value;
    }

    callback({
      args: params
    });
  }
  
  return (<form onSubmit={submit}>
    <div styleName="signup">

      <div><input type="text" className="form-control" ref={nickname} placeholder="名字" /></div>

      {type == 'phone' ?
        <div>
          <div className="row">
            <div className="col-4">
              <CountriesSelect
                onChange={(res: any)=>{
                  setAreaCode(res);
                  // if (this.state.isMount) this.state.areaCode = res;
                }}
                />
              </div>
            <div className="col-8 pl-0"><input type="text" className="form-control" ref={account} placeholder="手机号" /></div>
          </div>
        </div>
        :
        <div>
          <input type="text" className="form-control" ref={account} placeholder="邮箱" />
        </div>}

      <div>
        <input type="text" className="form-control" placeholder="输入 6 位验证码" ref={captcha} />
        <div styleName="captcha-button"><CaptchaButton onClick={sendCaptcha} /></div>
      </div>

      <div><input type="password" className="form-control" ref={password} placeholder="密码" /></div>

      <div styleName="gender">
      
        <span>性别</span>

        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="male" value="男" ref={male} />
          <label className="form-check-label" htmlFor="male">男</label>
        </div>

        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" name="gender" id="female" value="女" ref={female} />
          <label className="form-check-label" htmlFor="female">女</label>
        </div>

      </div>

      <div>
        {/* onClick={submit} */}
        <input type="submit" className="btn btn-primary" value="注册" />
      </div>

      <div className="text-center">

      {type == 'phone' ?
        <div><span className="a text-primary" onClick={()=>{ setType('email'); }}>使用邮箱注册</span></div>
        :
        <div><span className="a text-primary" onClick={()=>{ setType('phone'); }}>使用手机注册</span></div>}

      </div>

    </div>
  </form>)

}