import React from 'react';
import { decorate, observable } from "mobx"
import { observer } from "mobx-react"

class MobBtn {

}


decorate(Store, {
  employeesList: observable
})

export default MobBtn;