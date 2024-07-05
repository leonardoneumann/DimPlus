import React from 'react'
import { Avatar, Col, Row, Tag, Tooltip } from 'antd'
import { hascomboTagCSSProps, percentTagCSSProps } from './SharedCSSProps'
import { MetaComboDescription, MetaCombos } from '@root/src/scrapers/lightgg'

interface PlugComboMetaGridProps {
  metaCombos: MetaCombos
}

interface PlugComboMetaGridItemProps {
  plugComboData: MetaComboDescription
}

const PlugComboMetaGrid: React.FC<PlugComboMetaGridProps> = ({ metaCombos }) => {
  return (
    <Row gutter={[18, 18]} style={{ paddingTop: '10px' }}>
      {metaCombos.combos.map((row, index) => (
        <PlugComboMetaGridItem key={index} plugComboData={row} />
      ))}
    </Row>
  )
}

const PlugComboMetaGridItem: React.FC<PlugComboMetaGridItemProps> = ({ plugComboData }) => {
  return (
    <Col span={6}>
      <Tooltip title={plugComboData.names} trigger="hover">
        <Avatar src={plugComboData.imgs[0]} size={40} shape="circle" />
        <Avatar src={plugComboData.imgs[1]} size={40} shape="circle" />
      </Tooltip>
      {plugComboData.haveCombo ? (
        <Tooltip title="This item has this combo" trigger="hover">
          <Tag style={{ ...percentTagCSSProps, ...hascomboTagCSSProps }}>{plugComboData.percentText}</Tag>
        </Tooltip>
      ) : (
        <Tag style={percentTagCSSProps}>{plugComboData.percentText}</Tag>
      )}
    </Col>
  )
}

export default PlugComboMetaGrid
