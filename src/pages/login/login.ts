import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ApiProvider } from '../../providers/api/api';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userAuth: FormGroup;

  constructor(
    public api : ApiProvider,
    public toastController: ToastController,
    public navCtrl: NavController, 
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    public navParams: NavParams) {
      this.userAuth = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('',[Validators.required])
      });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  get f() { 
    return this.userAuth.controls; 
  }

  async login(){
   if(this.userAuth.valid){
        // this.navCtrl.setRoot(TabsPage);
        let params = {
          "email": this.userAuth.value.email,
          "password": this.userAuth.value.password
        };
        this.api._postAPI('auth/login',params).subscribe(
            async res  => {
              if(res.status == 200){
                if(res.data.role == 4){
                  this.navCtrl.setRoot(TabsPage);
                }else{
                  const alertmsg = await this.alertController.create({
                    title: 'Alert',
                    cssClass: 'secondary',
                    message: 'You are not authorised to use this app.',
                    buttons: ['OK']
                  });
                  await alertmsg.present();
                }
              }
              else{
                const alertmsg = await this.alertController.create({
                  title: 'Alert',
                  cssClass: 'secondary',
                  message: res.message,
                  buttons: ['OK']
                });
                await alertmsg.present();
              }
            },
            async err => {
              if(err.length >0){
                const alertmsg = await this.alertController.create({
                  title: 'Alert',
                  cssClass: 'secondary',
                  message: err,
                  buttons: ['OK']
                });
                await alertmsg.present();
              }
            }
        );
    }else{
      const alert = await this.alertController.create({
        title: 'Alert',
        message: 'Please enter valid email and password',
        buttons: ['OK']
      });
      await alert.present();
    }
    
  }

  async forgotpassword(){
    const toast = await this.toastController.create({
      message: 'You will be redirected to website...for password reset.',
      duration: 2000
    });
    toast.present();

    window.open('http://pyticketingsystem/forgotpassword?', '_system')
  }
}
