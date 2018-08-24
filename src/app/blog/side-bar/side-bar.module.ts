import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SideBarComponent } from './side-bar.component';
import { SideBarItemComponent } from './side-bar-item/side-bar-item.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [
        SideBarComponent,
        SideBarItemComponent
    ],
    exports: [
        SideBarComponent
    ]
})
export class SideBarModule {
}
