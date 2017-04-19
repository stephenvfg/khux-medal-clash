import alt from '../alt';
import MedalEditActions from '../actions/medal_edit_actions';

class MedalEditStore {
  constructor() {
    this.bindActions(MedalEditActions);

    this.urlSlug = '';

    this.user = '';
    this.id = '';

    this.file = '';
    this.imagePreviewUrl = '';

    this.name = '';
    this.no = '';
    this.affinity = '';
    this.attribute = '';
    this.baseStr = '';
    this.baseDef = '';
    this.spAtk = '';
    this.spDesc = '';
    this.target = '';
    this.tier = '';
    this.mult = '';
    this.gauges = '';
    this.isBoosted = '';
    this.strBoost = '';
    this.defBoost = '';
    this.helpBlock = '';
    this.nameValidationState = '';
    this.noValidationState = '';
    this.affinityValidationState = '';
    this.attributeValidationState = '';
    this.baseStrValidationState = '';
    this.baseDefValidationState = '';
    this.spAtkValidationState = '';
    this.spDescValidationState = '';
    this.targetValidationState = '';
    this.tierValidationState = '';
    this.multValidationState = '';
    this.gaugesValidationState = '';
    this.strBoostValidationState = '';
    this.defBoostValidationState = '';
  }

  onLoggedInSuccess(user) {
    this.user = user;
  }

  onLoggedInFail() { /* do nothing */ }

  onGetMedalSuccess(data) {
    this.id = data._id;
    this.imagePreviewUrl = data.imgPath;
    this.name = data.name;
    this.no = data.no;
    this.affinity = data.affinity;
    this.attribute = data.attribute;
    this.baseStr = data.baseStr;
    this.baseDef = data.baseDef;
    this.spAtk = data.spAtk;
    this.spDesc = data.spDesc;
    this.target = data.target;
    this.tier = data.tier;
    this.mult = data.mult;
    this.gauges = data.gauges;
    this.isBoosted = data.isBoosted;
    this.strBoost = data.strBoost;
    this.defBoost = data.defBoost;
  }

  onGetMedalFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onMedalEditSuccess(successMessage) {
    this.nameValidationState = 'has-success';
    if (this.helpBlock != successMessage) {
      this.helpBlock = successMessage;
    }
  }

  onMedalEditFail(errorMessage) {
    this.nameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onUploadSuccess(successMessage) { /* do nothing */ }

  onUploadFail(errorMessage) { }

  onUpdateFile(file) { this.file = file; }

  onUpdateImagePreviewUrl(url) {
    this.imagePreviewUrl = url;
  }

  onUpdateName(event) { 
    this.name = event.target.value;
    this.nameValidationState = '';
    this.helpBlock = '';
  }

  onUpdateNo(event) { 
    this.no = event.target.value;
    this.noValidationState = '';
  }

  onUpdateAffinity(event) { 
    this.affinity = event.target.value;
    this.affinityValidationState = '';
  }

  onUpdateAttribute(event) { 
    this.attribute = event.target.value;
    this.attributeValidationState = '';
  }

  onUpdateBaseStr(event) { 
    this.baseStr = event.target.value;
    this.baseStrValidationState = '';
  }

  onUpdateBaseDef(event) { 
    this.baseDef = event.target.value;
    this.baseDefValidationState = '';
  }

  onUpdateSpAtk(event) { 
    this.spAtk = event.target.value;
    this.spAtkValidationState = '';
  }

  onUpdateSpDesc(event) { 
    this.spDesc = event.target.value;
    this.spDescValidationState = '';
  }

  onUpdateTarget(event) { 
    this.target = event.target.value;
    this.targetValidationState = '';
  }

  onUpdateTier(event) { 
    this.tier = event.target.value;
    this.tierValidationState = '';
  }

  onUpdateMult(event) { 
    this.mult = event.target.value;
    this.multValidationState = '';
  }

  onUpdateGauges(event) { 
    this.gauges = event.target.value;
    this.gaugesValidationState = '';
  }

  onUpdateStrBoost(event) { 
    this.strBoost = event.target.value;
    this.strBoostValidationState = '';
  }

  onUpdateDefBoost(event) { 
    this.defBoost = event.target.value;
    this.defBoostValidationState = '';
  }

  onInvalidName(event) { 
    this.nameValidationState = 'has-error';
    this.helpBlock = 'Please enter a medal name.';
  }

  onInvalidNo(event) { this.noValidationState = 'has-error'; }
  onInvalidAffinity(event) { this.affinityValidationState = 'has-error'; }
  onInvalidAttribute(event) { this.attributeValidationState = 'has-error'; }
  onInvalidBaseStr(event) { this.baseStrValidationState = 'has-error'; }
  onInvalidBaseDef(event) { this.baseDefValidationState = 'has-error'; }
  onInvalidSpAtk(event) { this.spAtkValidationState = 'has-error'; }
  onInvalidSpDesc(event) { this.spDescValidationState = 'has-error'; }
  onInvalidTarget(event) { this.targetValidationState = 'has-error'; }
  onInvalidTier(event) { this.tierValidationState = 'has-error'; }
  onInvalidMult(event) { this.multValidationState = 'has-error'; }
  onInvalidGauges(event) { this.gaugesValidationState = 'has-error'; }
  onInvalidStrBoost(event) { this.strBoostValidationState = 'has-error'; }
  onInvalidDefBoost(event) { this.defBoostValidationState = 'has-error'; }
}

export default alt.createStore(MedalEditStore);