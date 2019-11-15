import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  account: any = {};

  constructor(private route: ActivatedRoute, private router: Router, protected auth: AuthService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.auth.editAccount(params.id).subscribe(res => {
        this.account = res;
      });
    });
  }

  addAccount(id) {
    this.route.params.subscribe(params => {
      this.auth.addAccount(this.account, id);
      this.router.navigate(['account']);
    });
  }

  removeAccount(id) {
    this.route.params.subscribe(params => {
      this.auth.removeAccount(this.account, id);
      this.router.navigate(['account']);
    });
  }

}
