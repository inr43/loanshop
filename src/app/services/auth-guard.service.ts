import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router:Router, 
    private localStorageToken: LocalstorageService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

      const token = this.localStorageToken.getToken();
  
      if ( token ) {
        console.log('AuthGuar token Found '+token);
        const tokenCode = JSON.parse(atob(token.split('.')[1]));
        console.log(tokenCode);
        if (!this._tokenExpired(tokenCode.exp))
        return true;
      }
  
      this.router.navigate(['/login']);
      return false;
    }

    private _tokenExpired(exp): boolean {
      const expiryDate = new Date(exp*1000);
      const currentDate = new Date( Date.now() );
  
      console.log(currentDate);
      console.log(expiryDate);
  
      if (currentDate > expiryDate)
      { 
        console.log("Time up");
        this.localStorageToken.removeToken();
        return true;      
      }
      return false;
    }  

}
