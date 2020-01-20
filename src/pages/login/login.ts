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
        email: new FormControl('kundansakpal@gmail.com', Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('password111',[Validators.required])
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
        this.navCtrl.setRoot(TabsPage);
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

    window.open('http://www.credencetechnology.in/contact', '_system')
  }
}
