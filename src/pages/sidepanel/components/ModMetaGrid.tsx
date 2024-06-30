import React from 'react'
import { Avatar, Col, Row, Tag, Tooltip } from 'antd'
import { percentTagCSSProps } from './SharedCSSProps'
import { MetaComboDescription, MetaCombos } from '@root/src/scrapers/lightgg'

interface ModMetaGridProps {
  metaCombos: MetaCombos
}

interface ModMetaGridItemProps {
  modData: MetaComboDescription
}

const ModMetaGrid: React.FC<ModMetaGridProps> = ({ metaCombos }) => {
  return (
    <Row gutter={[24, 24]} style={{ paddingTop: '10px' }}>
      {metaCombos.mods.map((row, index) => (
        <ModMetaItem key={index} modData={row} />
      ))}
    </Row>
  )
}

const ModMetaItem: React.FC<ModMetaGridItemProps> = ({ modData }) => {
  return (
    <Col span={6} style={percentTagCSSProps}>
      <Tooltip title={modData.names} trigger="hover">
        <Avatar src={modData.imgs[0]} size={40} shape="square" />
      </Tooltip>
      <Tag>{modData.percentText}</Tag>
    </Col>
  )
}

export default ModMetaGrid
