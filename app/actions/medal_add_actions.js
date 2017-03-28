import alt from '../alt';

class MedalAddActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'medalAddSuccess',
      'medalAddFail',
      'uploadSuccess',
      'uploadFail',
      'updateFile',
      'updateImagePreviewUrl',
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
      'updateIsBoosted',
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
      'invalidIsBoosted',
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

  addMedal(name, no, imgPath, affinity, attribute, baseStr, baseDef, spAtk, spDesc, target, tier, mult, 
      gauges, isGuilted, isBoosted, strBoost, defBoost, addedBy) {
    
    var slug = name.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    if (isGuilted) { slug += "-g"; }
    if (isBoosted) { slug += "-b"; }

    $.ajax({
      type: 'POST',
      url: '/api/medals',
      data: { 
        name: name,
        no: no,
        slug: slug,
        imgPath: imgPath,
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
        isGuilted: isGuilted,
        isBoosted: isBoosted,
        strBoost: strBoost,
        defBoost: defBoost,
        addedBy: addedBy
      }
    })
      .done((data) => {
        this.actions.medalAddSuccess(data.message);
      })
      .fail((jqXhr) => {
        this.actions.medalAddFail(jqXhr.responseJSON.message);
      });
  }

  upload(imageFile) {

    return new Promise((resolve, reject) => {
      let imageFormData = new FormData();

      imageFormData.append('imageFile', imageFile);
      
      var xhr = new XMLHttpRequest();
      
      xhr.open('post', '/api/upload', true);
      
      xhr.onload = function () {
        if (this.status == 200) {
          resolve(this.response);
        } else {
          reject(this.statusText);
        }
      };
      
      xhr.send(imageFormData);
    });
  }
}

export default alt.createActions(MedalAddActions);