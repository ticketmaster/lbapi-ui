import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VsTableComponent } from './plugins/vs-table/vs-table.component';
import { LbTableComponent } from './plugins/lb-table/lb-table.component';

const routes: Routes = [
{ path: 'vs', component: VsTableComponent },
{ path: 'lb', component: LbTableComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
