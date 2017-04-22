import React, { Component } from 'react';
import MedalEditStore from '../stores/medal_edit_store';
import MedalEditActions from '../actions/medal_edit_actions';

class MedalEdit extends Component {
  constructor(props) {
    super(props);
    this.state = MedalEditStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    MedalEditStore.listen(this.onChange);

    MedalEditActions.loggedIn();
    MedalEditActions.getMedal(this.props.params.slug);
  }

  componentWillUnmount() {
    MedalEditStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    var file = this.state.file;

    var user = this.state.user;
    var id = this.state.id;

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
      MedalEditActions.invalidName();
      valid = false;
    }

    if (!no) {
      MedalEditActions.invalidNo();
      valid = false;
    }

    if (!affinity) {
      MedalEditActions.invalidAffinity();
      valid = false;
    }

    if (!attribute) {
      MedalEditActions.invalidAttribute();
      valid = false;
    }

    if (!baseStr) {
      MedalEditActions.invalidBaseStr();
      valid = false;
    }

    if (!baseDef) {
      MedalEditActions.invalidBaseDef();
      valid = false;
    }

    if (!spAtk) {
      MedalEditActions.invalidSpAtk();
      valid = false;
    }

    if (!spDesc) {
      MedalEditActions.invalidSpDesc();
      valid = false;
    }

    if (!target) {
      MedalEditActions.invalidTarget();
      valid = false;
    }

    if (!tier) {
      MedalEditActions.invalidTier();
      valid = false;
    }

    if (!mult) {
      MedalEditActions.invalidMult();
      valid = false;
    }

    if (!gauges) {
      MedalEditActions.invalidGauges();
      valid = false;
    }

    if (isBoosted) {
      if (!strBoost) {
        MedalEditActions.invalidStrBoost();
        valid = false;
      }

      if (!defBoost) {
        MedalEditActions.invalidDefBoost();
        valid = false;
      }
    }

    if (valid) {
      MedalEditActions.editMedal(id, name, no, affinity, attribute, baseStr, baseDef, spAtk, spDesc, 
          target, tier, mult, gauges, strBoost, defBoost);
    } else {
      toastr.error('Please fill out all fields.');
    }
  }

  render() {

    let imagePreviewUrl = 'https://' + (process.env.S3_BUCKET || 'khux-medal-clash-assets') + '.s3.amazonaws.com/' + this.state.imagePreviewUrl;

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
                                 onChange={MedalEditActions.updateName} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.noValidationState}>
                          <label className='control-label'>No.</label>
                          <input type='text' className='form-control' ref='noTextField' value={this.state.no}
                                 onChange={MedalEditActions.updateNo} autoFocus/>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.affinityValidationState}>
                        <div className='radio radio-inline'>
                          <input type='radio' name='affinity' id='upright' value='upright' checked={this.state.affinity === 'upright'}
                                 onChange={MedalEditActions.updateAffinity}/>
                          <label htmlFor='upright'>Upright</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='affinity' id='reversed' value='reversed' checked={this.state.affinity === 'reversed'}
                                 onChange={MedalEditActions.updateAffinity}/>
                          <label htmlFor='reversed'>Reversed</label>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.attributeValidationState}>
                        <div className='radio radio-inline'>
                          <input type='radio' name='attribute' id='power' value='power' checked={this.state.attribute === 'power'}
                                 onChange={MedalEditActions.updateAttribute}/>
                          <label htmlFor='power'>Power</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='attribute' id='speed' value='speed' checked={this.state.attribute === 'speed'}
                                 onChange={MedalEditActions.updateAttribute}/>
                          <label htmlFor='speed'>Speed</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='attribute' id='magic' value='magic' checked={this.state.attribute === 'magic'}
                                 onChange={MedalEditActions.updateAttribute}/>
                          <label htmlFor='magic'>Magic</label>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.baseStrValidationState}>
                          <label className='control-label'>Base Strength</label>
                          <input type='text' className='form-control' ref='baseStrTextField' value={this.state.baseStr}
                                 onChange={MedalEditActions.updateBaseStr} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.baseDefValidationState}>
                          <label className='control-label'>Base Defense</label>
                          <input type='text' className='form-control' ref='baseDefTextField' value={this.state.baseDef}
                                 onChange={MedalEditActions.updateBaseDef} autoFocus/>
                        </div>
                      </div>
                      <div className={'form-group ' + this.state.spAtkValidationState}>
                        <label className='control-label'>Special Attack</label>
                        <input type='text' className='form-control' ref='spAtkTextField' value={this.state.spAtk}
                               onChange={MedalEditActions.updateSpAtk} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.spDescValidationState}>
                        <label className='control-label'>Special Attack Description</label>
                        <input type='text' className='form-control' ref='spDescTextField' value={this.state.spDesc}
                               onChange={MedalEditActions.updateSpDesc} autoFocus/>
                      </div>
                      <div className={'form-group ' + this.state.targetValidationState}>
                        <div className='radio radio-inline'>
                          <input type='radio' name='target' id='single' value='single' checked={this.state.target === 'single'}
                                 onChange={MedalEditActions.updateTarget}/>
                          <label htmlFor='single'>Single Target</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='target' id='all' value='all' checked={this.state.target === 'all'}
                                 onChange={MedalEditActions.updateTarget}/>
                          <label htmlFor='all'>All Targets</label>
                        </div>
                        <div className='radio radio-inline'>
                          <input type='radio' name='target' id='random' value='random' checked={this.state.target === 'random'}
                                 onChange={MedalEditActions.updateTarget}/>
                          <label htmlFor='random'>Random</label>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.tierValidationState}>
                          <label className='control-label'>Guilt Tier</label>
                          <input type='text' className='form-control' ref='tierTextField' value={this.state.tier}
                                 onChange={MedalEditActions.updateTier} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.multValidationState}>
                          <label className='control-label'>Multiplier</label>
                          <input type='text' className='form-control' ref='multTextField' value={this.state.mult}
                                 onChange={MedalEditActions.updateMult} autoFocus/>
                        </div>
                      </div>
                      <div className='col-sm-4'>
                        <div className={'form-group ' + this.state.gaugesValidationState}>
                          <label className='control-label'>Gauge Cost</label>
                          <input type='text' className='form-control' ref='gaugesTextField' value={this.state.gauges}
                                 onChange={MedalEditActions.updateGauges} autoFocus/>
                        </div>
                      </div>
                      { this.state.isBoosted 
                        ? (
                          <div>
                            <div className='col-sm-4'>
                              <div className={'form-group ' + this.state.isBoostedValidationState}>
                                <label>This medal is Boosted</label>
                              </div>
                            </div>
                            <div className='col-sm-4'>
                              <div className={'form-group ' + this.state.strBoostValidationState}>
                                <label className='control-label'>Strength Boost</label>
                                <input type='text' className='form-control' ref='strBoostTextField' value={this.state.strBoost}
                                       onChange={MedalEditActions.updateStrBoost} autoFocus/>
                              </div>
                            </div>
                            <div className='col-sm-4'>
                              <div className={'form-group ' + this.state.defBoostValidationState}>
                                <label className='control-label'>Defense Boost</label>
                                <input type='text' className='form-control' ref='defBoostTextField' value={this.state.defBoost}
                                       onChange={MedalEditActions.updateDefBoost} autoFocus/>
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
                  <div className='panel-heading'>You must have 'Contributor' rights to edit medals.</div>
                </div>
              ) 
            }
          </div>
          <div className='col-sm-4'>
            { this.state.user && this.state.user.contributor ? $imagePreview : '' }
          </div>
        </div>
      </div>
    );
  }
}

export default MedalEdit;