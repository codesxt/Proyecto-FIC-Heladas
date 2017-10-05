import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'roleTranslate',
  pure: false
})
export class RoleTranslatePipe implements PipeTransform {
  items = [
    {value: "user", name: "Usuario"},
    {value: "administrator", name: "Administrador"}
  ];
  transform(str: string) {
    for (let itm of this.items) {
      if(itm.value == str) return itm.name;
    }
    return str;
  }
}
