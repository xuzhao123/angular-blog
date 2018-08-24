import { Component, OnInit, HostBinding } from '@angular/core';
import { UtilService } from '../../util.service';
import { tipIn } from '../../animations';

@Component({
    selector: 'app-tip',
    templateUrl: './tip.component.html',
    styleUrls: ['./tip.component.scss'],
    animations: [tipIn]
})
export class TipComponent implements OnInit {
    // @HostBinding('@tipIn') state = 'hide';
    // @HostBinding('style.display') display = 'none';

    state = 'hide';
    tip: string = '';
    constructor(
        private utilServie: UtilService
    ) {

    }

    ngOnInit() {
        this.utilServie.onTip()
            .subscribe(tip => {
                this.tip = tip;
                this.state = 'show';
                setTimeout(() => {
                    this.state = 'hide';
                }, 1000);
            });
    }
}