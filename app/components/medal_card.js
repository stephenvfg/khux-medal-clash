import React from 'react';

export default (props) => {
	
	function getPctBonus(tier) {
		switch (tier) {
			case 1: return '25';
			case 2: return '50';
			case 3: return '100';
			case 4: return '130';
			case 5: return '150';
			default: return '';
		}
	}

	return (
    <div className='medal-card'>
    	<div className='row card-name'>
      	<div className='col-xs-3'>
	    		<p>No. <strong>{props.medal.no}</strong></p>
	    	</div>
      	<div className='col-xs-9'>
	    		<p><strong>{props.medal.name}</strong></p>
	    	</div>
	    </div>
    	<div className='row card-meta'>
      	<div className={'col-xs-3 aff-' + props.medal.affinity}>
		      <p><strong>{props.medal.affinity}</strong></p>
		    </div>
      	<div className={'col-xs-3 att-' + props.medal.attribute}>
		      <p><strong>{props.medal.attribute}</strong></p>
		    </div>
		    { props.medal.isGuilted ? (
	    		<div className='col-xs-3'>
		  			<p className="spText"><em>Guilted</em></p>
		  		</div>
			  ) : ('') } 
			  { props.medal.isBoosted ? (
	    		<div className='col-xs-3'>
		  			<p className="spText"><em>Boosted</em></p>
		  		</div>
			  ) : ('') }
		  </div>
    	<div className='row card-atk'>
      	<div className='col-xs-3'>
	    		<p>STR</p>
	    	</div>
      	<div className='col-xs-9'>
	    		<p className={ props.medal.strBoost && props.medal.strBoost > 0 ? ('spText') : ('') }><strong>
	    			{props.medal.baseStr + props.medal.strBoost}
	    		</strong></p>
	    	</div>
	    </div>
    	<div className='row card-def'>
      	<div className='col-xs-3'>
	    		<p>DEF</p>
	    	</div>
      	<div className='col-xs-9'>
	    		<p className={ props.medal.defBoost && props.medal.defBoost > 0 ? ('spText') : ('') }><strong>
	    			{props.medal.baseDef + props.medal.defBoost}
	    		</strong></p>
	    	</div>
	    </div>
    	<div className='row card-spatk'>
      	<div className='col-xs-3'>
		      <p>Special</p>
      	</div>
      	<div className='col-xs-9'>
      		<p><strong>{props.medal.spAtk}</strong></p>
      	</div>
      </div>
    	<div className='row card-sptarget'>
      	<div className='col-xs-3'>
		      <p>Target</p>
      	</div>
      	<div className='col-xs-5'>
      		<p><strong>{props.medal.target}</strong></p>
      	</div>
			  { props.medal.isGuilted ? (
  				<div className='col-xs-4'>
	    			<img className="guilted" src={'/img/g_' + props.medal.tier + '.png'}></img>
	    			<p className="spText">+<strong>{ getPctBonus(props.medal.tier) }</strong>%</p>
	    		</div>
			  ) : ('') }
		  </div>
    	<div className='row card-spdmg'>
      	<div className='col-xs-3'>
		      <p>Damage</p>
      	</div>
      	<div className='col-xs-9'>
      		<p><strong>{props.medal.mult}</strong></p>
      	</div>
      </div>
    	<div className='row card-spcost'>
      	<div className='col-xs-3'>
		      <p>Gauges</p>
      	</div>
      	<div className='col-xs-9'>
      		<p><strong>{props.medal.gauges}</strong></p>
      	</div>
      </div>
    	<div className='row card-spdesc'>
      	<div className='col-xs-12'>
		      <p><strong>{props.medal.spDesc}</strong></p>
      	</div>
      </div>
    </div>
	);
}