import React from 'react';

export default (props) => {
	return (
    <div className='medal-image'>
      { props.isGuilted ? (<img className="guilted" src={'/img/g_' + props.tier + '.png'}></img>) : ('') }
      <img className={props.cl} onClick={props.onClick} src={__dirname + '/../../api/uploads/' + props.dir + '/' + props.imgPath}/>
      { props.isBoosted ? (<img className="boosted" src={'/img/boosted' + props.large + '.png'}></img>) : ('') }
    </div>
	);
}