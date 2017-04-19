import { assign, contains } from 'underscore';
import alt from '../alt';
import MedalActions from '../actions/medal_actions';

class MedalStore {
  constructor() {
    this.bindActions(MedalActions);

    this.medal = '';

    this.stdVer = '';
    this.gltVer = '';
    this.bstVer = '';
    this.gltBstVer = '';

    this.winLossRatio = 0;
  }

  onGetMedalSuccess(data) {
    this.medal = data;
    MedalActions.getVariants(this.medal.no);
    $(document.body).attr('class', 'profile-' + this.medal.affinity + '-' + this.medal.attribute);
    // If is NaN (from division by zero) then set it to "0"
    this.winLossRatio = ((this.medal.wins / (this.medal.wins + this.medal.losses) * 100) || 0).toFixed(1);
  }

  onGetMedalFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onGetVariantsSuccess(data) {
    var gltBstVer = '';
    var bstVer = '';
    var gltVer = '';
    var stdVer = '';

    data.forEach(function(obj) {
      if (obj.isGuilted && obj.isBoosted) { gltBstVer = obj; }
      if (!obj.isGuilted && obj.isBoosted) { bstVer = obj; }
      if (obj.isGuilted && !obj.isBoosted) { gltVer = obj; }
      if (!obj.isGuilted && !obj.isBoosted) { stdVer = obj; }
    });

    this.gltBstVer = gltBstVer;
    this.bstVer = bstVer;
    this.gltVer = gltVer;
    this.stdVer = stdVer;
  }

  onGetVariantsFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(MedalStore);