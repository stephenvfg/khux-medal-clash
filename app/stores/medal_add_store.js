import alt from '../alt';
import MedalAddActions from '../actions/medal_add_actions';

class MedalAddStore {
  constructor() {
    this.bindActions(MedalAddActions);

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
    this.isBoostedValidationState = '';
    this.strBoostValidationState = '';
    this.defBoostValidationState = '';
  }

  onMedalAddSuccess(successMessage) {
    this.nameValidationState = 'has-success';
    if (this.helpBlock != successMessage) {
      this.helpBlock = successMessage;
    }
  }

  onMedalAddFail(errorMessage) {
    this.nameValidationState = 'has-error';
    this.helpBlock = errorMessage;
  }

  onUploadSuccess(successMessage) { }

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

  onUpdateIsBoosted(event) { 
    this.isBoosted = event.target.value;
    this.isBoostedValidationState = '';
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
  onInvalidIsBoosted(event) { this.isBoostedValidationState = 'has-error'; }
  onInvalidStrBoost(event) { this.strBoostValidationState = 'has-error'; }
  onInvalidDefBoost(event) { this.defBoostValidationState = 'has-error'; }
}

export default alt.createStore(MedalAddStore);