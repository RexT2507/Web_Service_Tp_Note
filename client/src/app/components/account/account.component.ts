import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  constructor() { }

  userName: string;
  userSurname: string;
  userEmail: string;
  userAccount: number;
  userBank: string;

  ngOnInit() {
    const token = localStorage.getItem('token');
    const splitToken = token.split('.');
    const tokenSlipted = splitToken[1];
    const tokenDecodeB64 = atob(tokenSlipted);
    const parseToken = JSON.parse(tokenDecodeB64);
    const tokenSub = parseToken.sub;

    const email = JSON.parse(tokenSub).email;
    this.userEmail = email;

    const name = JSON.parse(tokenSub).name;
    this.userName = name;

    const surname = JSON.parse(tokenSub).surname;
    this.userSurname = surname;

    const account = JSON.parse(tokenSub).account;
    this.userAccount = account;

    const bank = JSON.parse(tokenSub).bank;
    this.userBank = bank;
  }

}
