import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, AlertController, App, Platform, ViewController } from 'ionic-angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { ApiProvider } from '../../providers/api/api';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  ticket: FormGroup;
  qrData = null;
  createdCode = null;
  scannedCode = null;
  translate: any;
  attendeedata: any;
  encodedData: any;
  
  constructor(
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    public navCtrl: NavController,
    public api : ApiProvider,
    private app: App,
    public platform: Platform,
    public viewCtrl: ViewController,
    public alertController: AlertController,
    private toastCtrl: ToastController,
    private barcodeScanner: BarcodeScanner) {
      this.ticket = this.formBuilder.group({
        ticketnumber: new FormControl('',[Validators.required])
      });
  }
 
  scanCode() {
    this.attendeedata = null;
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a QRCode inside the scan area',
      resultDisplayDuration: 500,
      disableSuccessBeep: false,
      orientation: 'portrait'
    };
   
    this.barcodeScanner.scan(options).then(barcodeData => {
      this.scannedCode = JSON.parse(barcodeData.text);
      let params = {
        "userId": this.scannedCode[0].UserId,
        "bookingId": this.scannedCode[0].TicketId,
        "eventId": this.scannedCode[0].EventId
      };
  
      // alert('params:' + JSON.stringify(params));
      this.api._postAPI('event/check-in',params).subscribe(
          async res  => {
            
            if(res.status == 200){
              this.attendeedata = res.data;
              const alertmsg = await this.alertController.create({
                title: 'Alert',
                cssClass: 'secondary',
                message: 'This is valid ticket.',
                buttons: ['OK']
              });
          
              await alertmsg.present();
            }else{
              const alertmsg = await this.alertController.create({
                title: 'Alert',
                cssClass: 'secondary',
                message: 'Ticket Already CheckIn or Kindly contact system admin.',
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
    }, async (err) => {
        const alertmsg = await this.alertController.create({
          title: 'Alert',
          cssClass: 'secondary',
          message: 'Error! QR code scanning not supported',
          buttons: ['OK']
        });
    
        await alertmsg.present();
    });
  }

  manualCheckIn(){
    this.api._getAPI('event/booking?bookingId='+this.ticket.value.ticketnumber).subscribe(
        async res  => {
          if(res.status == 200){
            this.attendeedata = res.data;
            const alertmsg = await this.alertController.create({
              title: 'Alert',
              cssClass: 'secondary',
              message: 'This is valid ticket.',
              buttons: ['OK']
            });
            await alertmsg.present();
          }else{
            const alertmsg = await this.alertController.create({
              title: 'Alert',
              cssClass: 'secondary',
              message: 'Ticket Already CheckIn or Kindly contact system admin.',
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
  }


    initializeApp() {
      this.platform.registerBackButtonAction(() => {
        // Catches the active view
        let nav = this.app.getActiveNavs()[0];
        nav.pop()
        let activeView = nav.getActive();                
        // Checks if can go back before show up the alert
        if(activeView.name === 'HomePage') {
            if (nav.canGoBack()){
                nav.pop();
            } else {
                const alert = this.alertController.create({
                    title: 'Fechar o App',
                    message: 'Você tem certeza?',
                    buttons: [{
                        text: 'Cancelar',
                        role: 'cancel',
                        handler: () => {
                          // this.nav.setRoot('HomePage');
                          console.log('** Saída do App Cancelada! **');
                        }
                    },{
                        text: 'Fechar o App',
                        handler: () => {
                          // this.logout();
                          this.navCtrl.popToRoot();
                          // this.platform.exitApp();
                        }
                    }]
                });
                alert.present();
            }
        }
    });
    }


  async logout(){
    // let nav = this.app.getActiveNavs()[0];
    //     nav.pop()
    // this.nav.setRoot('LoginPage');
    this.viewCtrl.dismiss();
    const alert = this.alertController.create({
      title: 'Alert!',
      message: 'Are you sure You want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            this.navCtrl.popToRoot();
          }
        }, {
          text: 'Okay',
          handler: () => {
           // this.navCtrl.popTo(LoginPage);
            // this.navCtrl.popToRoot();
            //  const root = this.app.getRootNav();
            //  root.popToRoot();
          }
        }
      ]
    });

    await alert.present();
    
  }

}
