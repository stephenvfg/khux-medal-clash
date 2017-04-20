import alt from '../alt';

class MedalAddActions {
  constructor() {
    this.generateActions(
      'loggedInSuccess',
      'loggedInFail',
      'medalAddSuccess',
      'medalAddFail',
      'signSuccess',
      'signFail',
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

  signUpload(imageFile) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/sign-s3?file-name=${imageFile.name}&file-type=${imageFile.type}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          var data = {
            file: imageFile,
            signedRequest: response.signedRequest,
            url: response.url
          };
          this.actions.signSuccess(data);
        }
        else{
          this.actions.signFail('Could not get signed URL to upload image.');
        }
      }
    };
    xhr.send();
  }

  uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          this.actions.uploadSuccess(url);
        }
        else{
          this.actions.uploadFail('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }
}

export default alt.createActions(MedalAddActions);