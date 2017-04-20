import React from 'react';

export default (props) => {
	
	let basePath = 'https://' + (process.env.S3_BUCKET || 'khux-medal-clash-assets') + '.s3.amazonaws.com/';

	return (
    <div className='medal-image'>
      { props.isGuilted ? (<img className="guilted" src={'/img/g_' + props.tier + '.png'}></img>) : ('') }
      <img className={props.cl} onClick={props.onClick} src={basePath + props.imgPath}/>
      { props.isBoosted ? (<img className="boosted" src={'/img/boosted' + props.large + '.png'}></img>) : ('') }
    </div>
	);
}