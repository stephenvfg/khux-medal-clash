import alt from '../alt';

class MedalEditActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'getMedalSuccess',
      'getMedalFail',
      'medalEditSuccess',
      'medalEditFail',
      'updateName',
      'updateNo',
      'updateAffinity',
      'updateAttribute',
      'updateBaseStr',
      'updateBaseDef',
      'updateSpAtk',
      'updateSpDesc',
      'updateTarget',
      'updateTier',
      'updateMult',
      'updateGauges',
      'updateDefBoost',
      'updateStrBoost',
      'invalidName',
      'invalidNo',
      'invalidAffinity',
      'invalidAttribute',
      'invalidBaseStr',
      'invalidBaseDef',
      'invalidSpAtk',
      'invalidSpDesc',
      'invalidTarget',
      'invalidTier',
      'invalidMult',
      'invalidGauges',
      'invalidDefBoost',
      'invalidStrBoost',
    );
  }

  loggedIn() {
    $.ajax({ url: '/api/login' })
      .done((data) => {
        this.actions.loggedInSuccess(data.user);
      })
      .fail((jqXhr) => {
        this.actions.loggedInFail();
      });
  }

  getMedal(slug) {
    $.ajax({ url: '/api/medals/slug/' + slug })
      .done((data) => {
        this.actions.getMedalSuccess(data);
      })
      .fail((jqXhr) => {
        this.actions.getMedalFail(jqXhr);
      });
  }

  editMedal(id, name, no, affinity, attribute, baseStr, baseDef, spAtk, spDesc, target, tier, mult, 
      gauges, strBoost, defBoost) {
    
    var slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    $.ajax({
      type: 'PUT',
      url: '/api/medals/' + id,
      data: { 
        name: name,
        no: no,
        slug: slug,
        affinity: affinity,
        attribute: attribute,
        baseStr: baseStr,
        baseDef: baseDef,
        spAtk: spAtk,
        spDesc: spDesc,
        target: target,
        tier: tier,
        mult: mult,
        gauges: gauges,
        strBoost: strBoost,
        defBoost: defBoost
      }
    })
      .done((data) => {
        this.actions.medalEditSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.medalEditFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(MedalEditActions);