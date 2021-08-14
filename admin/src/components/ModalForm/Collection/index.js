import React, { useState } from 'react';

import { Inputs } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';

import SelectContentTypes from '../../SelectContentTypes';
import HeaderModalNavContainer from '../../HeaderModalNavContainer';
import HeaderNavLink from '../../HeaderNavLink';

import form from '../mapper';
import InputUID from '../../inputUID';

const NAVLINKS = [{ id: 'base' }, { id: 'advanced' }];

const CollectionForm = (props) => {
  const [tab, setTab] = useState('base');
  const globalContext = useGlobalContext();

  const {
    contentTypes,
    onChange,
    onCancel,
    id,
    modifiedState,
    uid,
    setUid,
    patternInvalid,
    setPatternInvalid,
  } = props;

  const handleSelectChange = (e) => {
    const contentType = e.target.value;
    if (contentType === '- Choose Content Type -') return;

    setUid(contentType);

    // Set initial values
    onCancel(false);
    Object.keys(form).map((input) => {
      onChange(contentType, input, form[input].value);
    });
  };

  return (
    <div className="container-fluid">
      <section style={{ marginTop: 20 }}>
        <div style={{ position: 'relative' }}>
          <h2><strong>{globalContext.formatMessage({ id: 'sitemap.Modal.Title' })}</strong></h2>
          {!id && (
            <p style={{ maxWidth: 500 }}>{globalContext.formatMessage({ id: `sitemap.Modal.CollectionDescription` })}</p>
          )}
          <HeaderModalNavContainer>
            {NAVLINKS.map((link, index) => {
              return (
                <HeaderNavLink
                  isActive={tab === link.id}
                  key={link.id}
                  {...link}
                  onClick={() => {
                    setTab(link.id);
                  }}
                  nextTab={index === NAVLINKS.length - 1 ? 0 : index + 1}
                />
              );
            })}
          </HeaderModalNavContainer>
        </div>
        <form className="row" style={{ borderTop: '1px solid #f5f5f6', paddingTop: 30, marginTop: 10 }}>
          <div className="col-md-6">
            <SelectContentTypes
              contentTypes={contentTypes}
              onChange={(e) => handleSelectChange(e)}
              value={uid}
              disabled={id}
              modifiedContentTypes={modifiedState}
            />
          </div>
          <div className="col-md-6">
            {tab === 'base' && (
              <div>
                <InputUID
                  onChange={async (e) => {
                    if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                      onChange(uid, 'pattern', e.target.value);
                      setPatternInvalid({ invalid: false });
                    }
                  }}
                  invalid={patternInvalid.invalid}
                  error={patternInvalid.message}
                  label={globalContext.formatMessage({ id: 'sitemap.Settings.Field.Pattern.Label' })}
                  placeholder="/en/pages/[id]"
                  name="pattern"
                  value={modifiedState.getIn([uid, 'pattern'], '')}
                  disabled={!uid}
                />
                <p style={{ marginBottom: 0 }}>Create a dynamic URL pattern for the type. Use fields of the type as part of the URL by escaping them like so: [url-field].</p>
                {contentTypes[uid] && (
                  <div>
                    <p>Choose from the fields listed below:</p>
                    <ul style={{ fontWeight: 500, marginBottom: 0, paddingLeft: 0, listStyle: 'none' }}>
                      {contentTypes[uid].map((fieldName) => (
                        <li key={fieldName}>{`[${fieldName}]`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {tab === 'advanced' && (
              <div className="row">
                {Object.keys(form).map((input) => (
                  <div className={form[input].styleName} key={input}>
                    <Inputs
                      name={input}
                      disabled={!uid}
                      {...form[input]}
                      onChange={(e) => onChange(uid, e.target.name, e.target.value)}
                      value={modifiedState.getIn([uid, input], form[input].value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default CollectionForm;
