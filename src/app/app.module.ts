import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CdkTreeModule } from '@angular/cdk/tree';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
/* ************************************************************************** */
import { CreateVsDialogComponent } from './plugins/create-vs-dialog/create-vs-dialog.component';
import { VsService } from './services/vs.service';
import { LbService } from './services/lb.service';
import { DeleteLbDialogComponent } from './plugins/delete-lb-dialog/delete-lb-dialog-component';
import { DeleteVsDialogComponent } from './plugins/delete-vs-dialog/delete-vs-dialog-component';
import { EditVsDialogComponent } from './plugins/edit-vs-dialog/edit-vs-dialog.component';
import { LbTableComponent } from './plugins/lb-table/lb-table.component';
import { LoginComponent } from './plugins/login/login.component';
import { QueueComponent } from './plugins/queue/queue.component';
import { QueueService } from './services/queue.service';
import { TokenService } from './services/token.service';
import { ToolbarComponent } from './plugins/toolbar/toolbar.component';
import { UserComponent } from './plugins/user/user.component';
import { UserService } from './services/user.service';
import { VsTableComponent } from './plugins/vs-table/vs-table.component';
import { FilterSheetComponent } from './plugins/filter-sheet/filter-sheet.component';
import { FilterSheetService } from './services/filter-sheet.service';
import { NoCacheHeadersInterceptor } from './common/cache-control';
import { MigrateDialogComponent } from './plugins/migrate-dialog/migrate-dialog.component';
import { MigrateDialogService } from './services/migrate-dialog.service';
import { RecycleService } from './services/recycle.service';
import { RecycleDialogService } from './services/recycle-dialog.service';
import { RecycleDialogComponent } from './plugins/recycle-dialog/recycle-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateVsDialogComponent,
    DeleteLbDialogComponent,
    DeleteVsDialogComponent,
    EditVsDialogComponent,
    LbTableComponent,
    LoginComponent,
    QueueComponent,
    ToolbarComponent,
    UserComponent,
    VsTableComponent,
    FilterSheetComponent,
    MigrateDialogComponent,
    RecycleDialogComponent,
  ],
  imports: [
    AppRoutingModule,
    MatListModule,
    MatBottomSheetModule,
    MatSnackBarModule,
    MatDividerModule,
    BrowserAnimationsModule,
    BrowserModule,
    CdkTreeModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatProgressBarModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    ReactiveFormsModule,
  ],
  providers: [
    VsService,
    FormsModule,
    QueueService,
    TokenService,
    UserService,
    FilterSheetService,
    MigrateDialogService,
    RecycleService,
    RecycleDialogService,
    LbService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoCacheHeadersInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
