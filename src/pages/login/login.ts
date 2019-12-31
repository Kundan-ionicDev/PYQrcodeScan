import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ApiProvider } from '../../providers/api/api';
import { catchError } from 'rxjs/operators';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
    public navParams: NavParams) {
      this.userAuth = this.formBuilder.group({
        email: new FormControl('', Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        password: new FormControl('',[Validators.required, Validators.minLength(6)])
      });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LoginPage');
  }

  get f() { return this.userAuth.controls; }

  login(){
   if(this.userAuth.valid){
        // this.navCtrl.setRoot(TabsPage);
        let params = {
          "email": this.userAuth.value.email,
          "password": this.userAuth.value.password
        };
        this.api._postAPI('auth/login',params).subscribe(
            res  => {
              // alert('HTTP response'+ JSON.stringify(res));
              if(res.status ==200){
                this.navCtrl.setRoot(TabsPage);
              }else{
                alert('Error');
              }
            },
            err => {
              if(err.length >0){
                // alert('HTTP Error'+ err)
              }
            }
        );
    }else{
      alert('Please Enter Valid Login credentials...');
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
