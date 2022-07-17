import React, { useEffect, useState } from 'react';

function Image(props){

    const [loading, setLoading] = useState(true);

    return (
        <div className={`Image_wrapper`}>
          <img
            className={`transition-ease ${loading === true ? `opacity-0` : `opacity-1`}`}
            src={props.source}
            onLoad={() => setLoading(false)}
            alt={props.altTxt}
          />
        </div>
    );
}
export default Image;