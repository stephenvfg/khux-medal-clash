import React, { Component } from 'react';
import MedalAddStore from '../stores/medal_add_store';
import MedalAddActions from '../actions/medal_add_actions';

class MedalAdd extends Component {
  constructor(props) {
    super(props);
    this.state = MedalAddStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MedalAddStore.listen(this.onChange);

    MedalAddActions.loggedIn();
  }

  componentWillUnmount() {
    MedalAddStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleUpload(event) {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      MedalAddActions.updateFile(file);
      MedalAddActions.updateImagePreviewUrl(reader.result);
    }
    reader.readAsDataURL(file);
  }

  handleSubmit(event) {
    event.preventDefault();

    var file = this.state.file;
    var user = this.state.user;

    var name = this.state.name.trim();
    var no = this.state.no;
    var affinity = this.state.affinity.trim();
    var attribute = this.state.attribute.trim();
    var baseStr = this.state.baseStr;
    var baseDef = this.state.baseDef;
    var spAtk = this.state.spAtk.trim();
    var spDesc = this.state.spDesc.trim();
    var target = this.state.target.trim();
    var tier = this.state.tier;
    var mult = this.state.mult.trim();
    var gauges = this.state.gauges;
    var isBoosted = this.state.isBoosted;
    var strBoost = this.state.strBoost;
    var defBoost = this.state.defBoost;

    var valid = true;

    if (!name) {
      MedalAddActions.invalidName();
      valid = false;
    }

    if (!no) {
      MedalAddActions.invalidNo();
      valid = false;
    }

    if (!affinity) {
      MedalAddActions.invalidAffinity();
      valid = false;
    }

    if (!attribute) {
      MedalAddActions.invalidAttribute();
      valid = false;
    }

    if (!baseStr) {
      MedalAddActions.invalidBaseStr();
      valid = false;
    }

    if (!baseDef) {
      MedalAddActions.invalidBaseDef();
      valid = false;
    }

    if (!spAtk) {
      MedalAddActions.invalidSpAtk();
      valid = false;
    }

    if (!spDesc) {
      MedalAddActions.invalidSpDesc();
      valid = false;
    }

    if (!target) {
      MedalAddActions.invalidTarget();
      valid = false;
    }

    if (!tier) {
      MedalAddActions.invalidTier();
      valid = false;
    }

    if (!mult) {
      MedalAddActions.invalidMult();
      valid = false;
    }

    if (!gauges) {
      MedalAddActions.invalidGauges();
      valid = false;
    }

    if (isBoosted) {
      if (!strBoost) {
        MedalAddActions.invalidStrBoost();
        valid = false;
      }

      if (!defBoost) {
        MedalAddActions.invalidDefBoost();
        valid = false;
      }
    }

    if (valid) {
      MedalAddActions.signUpload(file);

      MedalAddActions.addMedal(name, no, file.name, affinity, attribute, baseStr, baseDef, spAtk, spDesc, 
          target, tier, mult, gauges, false, false, 0, 0, user._id);
      MedalAddActions.addMedal(name + ' (Guilted)', no, file.name, affinity, attribute, baseStr, baseDef, spAtk, spDesc, 
          target, tier, mult, gauges, true, false, 0, 0, user._id);
      
      if (isBoosted) {
        MedalAddActions.addMedal(name + ' (Boosted)', no, file.name, affinity, attribute, baseStr, baseDef, spAtk, spDesc, 
            target, tier, mult, gauges, false, true, strBoost, defBoost, user._id);
        MedalAddActions.addMedal(name + ' (Boosted) (Guilted)', no, file.name, affinity, attribute, baseStr, baseDef, spAtk, spDesc, 
            target, tier, mult, gauges, true, true, strBoost, defBoost, user._id);
      }
    } else {
      toastr.error('Please fill out all fields.');
    }
  }

  render() {

    let { imagePreviewUrl } = this.state;

    let $imagePreview = null;

    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} width='100%'/>);
    }

    return (
      <div className='container'>
        <div className='row flipInX animated'>
          <div className='col-sm-8'>
            { this.state.user && this.state.user.contributor 
              ? (
                <div className='panel panel-default'>
                  <div className='panel-heading'>Add Medal</div>
                  <div className='panel-body'>
                    <form onSubmit={this.handleSubmit.bind(this)} encType="multipart/form-data">
                      <div className='col-sm-8'>
                        <div className={'form-group ' + this.state.nameValidationState}>
                          <label className='control-label'>Medal Name</label>
                          <input type='text' className='form-control' ref='nameTextField' value={this.state.name}
                                 onChange={MedalAddActions.updateName} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.noValidationState}>
                          <label className='control-label'>No.</label>
                          <input type='text' className='form-control' ref='noTextField' value={this.state.no}
                                 onChange={MedalAddActions.updateNo} autoFocus/>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.imgPathValidationState}>
                        <label className='control-label'>Medal Image</label>
                        <input type='file' accept='image/*' onChange={this.handleUpload.bind(this)} name='image'/>
                      </div>
                      <div className={'form-group ' + this.state.affinityValidationState}>
                        <div className='radio radio-inline'>
                          <input type='radio' name='affinity' id='upright' value='upright' checked={this.state.affinity === 'upright'}
                                 onChange={MedalAddActions.updateAffinity}/>
                          <label htmlFor='upright'>Upright</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='affinity' id='reversed' value='reversed' checked={this.state.affinity === 'reversed'}
                                 onChange={MedalAddActions.updateAffinity}/>
                          <label htmlFor='reversed'>Reversed</label>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.attributeValidationState}>
                        <div className='radio radio-inline'>
                          <input type='radio' name='attribute' id='power' value='power' checked={this.state.attribute === 'power'}
                                 onChange={MedalAddActions.updateAttribute}/>
                          <label htmlFor='power'>Power</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='attribute' id='speed' value='speed' checked={this.state.attribute === 'speed'}
                                 onChange={MedalAddActions.updateAttribute}/>
                          <label htmlFor='speed'>Speed</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='attribute' id='magic' value='magic' checked={this.state.attribute === 'magic'}
                                 onChange={MedalAddActions.updateAttribute}/>
                          <label htmlFor='magic'>Magic</label>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.baseStrValidationState}>
                          <label className='control-label'>Base Strength</label>
                          <input type='text' className='form-control' ref='baseStrTextField' value={this.state.baseStr}
                                 onChange={MedalAddActions.updateBaseStr} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.baseDefValidationState}>
                          <label className='control-label'>Base Defense</label>
                          <input type='text' className='form-control' ref='baseDefTextField' value={this.state.baseDef}
                                 onChange={MedalAddActions.updateBaseDef} autoFocus/>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.spAtkValidationState}>
                        <label className='control-label'>Special Attack</label>
                        <input type='text' className='form-control' ref='spAtkTextField' value={this.state.spAtk}
                               onChange={MedalAddActions.updateSpAtk} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.spDescValidationState}>
                        <label className='control-label'>Special Attack Description</label>
                        <input type='text' className='form-control' ref='spDescTextField' value={this.state.spDesc}
                               onChange={MedalAddActions.updateSpDesc} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.targetValidationState}>
                        <div className='radio radio-inline'>
                          <input type='radio' name='target' id='single' value='single' checked={this.state.target === 'single'}
                                 onChange={MedalAddActions.updateTarget}/>
                          <label htmlFor='single'>Single Target</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='target' id='all' value='all' checked={this.state.target === 'all'}
                                 onChange={MedalAddActions.updateTarget}/>
                          <label htmlFor='all'>All Targets</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='target' id='random' value='random' checked={this.state.target === 'random'}
                                 onChange={MedalAddActions.updateTarget}/>
                          <label htmlFor='random'>Random</label>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.tierValidationState}>
                          <label className='control-label'>Guilt Tier</label>
                          <input type='text' className='form-control' ref='tierTextField' value={this.state.tier}
                                 onChange={MedalAddActions.updateTier} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.multValidationState}>
                          <label className='control-label'>Multiplier</label>
                          <input type='text' className='form-control' ref='multTextField' value={this.state.mult}
                                 onChange={MedalAddActions.updateMult} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.gaugesValidationState}>
                          <label className='control-label'>Gauge Cost</label>
                          <input type='text' className='form-control' ref='gaugesTextField' value={this.state.gauges}
                                 onChange={MedalAddActions.updateGauges} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.isBoostedValidationState}>
                          <input type='checkbox' name='isBoosted' id='isBoosted' value='isBoosted'
                              onChange={MedalAddActions.updateIsBoosted}/>
                          <label htmlFor='isBoosted'>&nbsp; Medal is Boosted</label>
                        </div>
                      </div>
                      { this.state.isBoosted
                        ? (
                          <div>
                            <div className='col-sm-4'>
                              <div className={'form-group ' + this.state.strBoostValidationState}>
                                <label className='control-label'>Strength Boost</label>
                                <input type='text' className='form-control' ref='strBoostTextField' value={this.state.strBoost}
                                       onChange={MedalAddActions.updateStrBoost} autoFocus/>
                              </div>
                            </div>
                            <div className='col-sm-4'>
                              <div className={'form-group ' + this.state.defBoostValidationState}>
                                <label className='control-label'>Defense Boost</label>
                                <input type='text' className='form-control' ref='defBoostTextField' value={this.state.defBoost}
                                       onChange={MedalAddActions.updateDefBoost} />
                              </div>
                            </div>
                          </div>
                        ) : '' }
                      <button type='submit' className='btn btn-primary'>Submit</button>
                    </form>
                  </div>
                </div>
              ) 
              : (
                <div className='panel panel-default'>
                  <div className='panel-heading'>You must have 'Contributor' rights to add medals.</div>
                </div>
              ) 
            }
          </div>
          <div className='col-sm-4 flipInX animated'>
            <div className='panel panel-default'>
              <div className='panel-heading'>Info</div>
              <div className='panel-body'>
                <p>This form will add multiple variations of the same medal:</p>
                <ul>
                  <li><strong>Base version</strong> of the medal (no guilt or boost)</li>
                  <li><strong>Guilted version</strong> of the medal (special attack bonus unlocked)</li>
                </ul>
                <p>If this medal comes with a boosted version then two more variations will be added:</p>
                <ul>
                  <li><strong>Boosted version</strong> of the medal</li>
                  <li><strong>Guilted version of the boosted medal</strong></li>
                </ul>
              </div>
            </div>
            { $imagePreview ? (
              <div className='panel panel-default'>
                <div className='panel-heading'>Medal Preview</div>
                <div className='panel-body'>
                  { $imagePreview }
                </div>
              </div>
            ) : '' }
          </div>
        </div>
      </div>
    );
  }
}

export default MedalAdd;