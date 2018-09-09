import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Measure from 'react-measure';
import { FormattedMessage, intlShape } from 'react-intl';

import FactionNotSaved from 'components/faction-table/faction-not-saved';
import CollapsibleTable from 'primitives/other/collapsible-table';
import FlexContainer from 'primitives/container/flex-container';
import Header, { HeaderType } from 'primitives/text/header';
import ButtonLink from 'primitives/other/button-link';
import BasicLink from 'primitives/other/basic-link';
import Loading from 'primitives/regions/loading';
import Button from 'primitives/other/button';

import { RotateCcw, Minus, ChevronUp, ChevronDown } from 'constants/icons';
import { isArray } from 'constants/lodash';

import './style.css';

const formatOptionalMessage = (intl, key, builder) => {
  const id = builder(key);
  return intl.messages[id] ? intl.formatMessage({ id }) : key;
};

const buildFactionTableColumns = ({ intl, windowWidth, sector }) => {
  const columnConfig = [
    {
      accessor: 'name',
      Header: 'misc.name',
      Cell: (name, { key, relationship }) => {
        const id = `faction.assets.${name}`;
        if (intl.messages[id]) {
          return intl.formatMessage({ id });
        }
        let icon;
        if (relationship === 'neutral') {
          icon = <Minus size={14} className="FactionTable-Relationship" />;
        } else if (relationship === 'friendly') {
          icon = (
            <ChevronUp
              size={14}
              className="FactionTable-Relationship FactionTable-Relationship--friendly"
            />
          );
        } else if (relationship === 'hostile') {
          icon = (
            <ChevronDown
              size={14}
              className="FactionTable-Relationship FactionTable-Relationship--hostile"
            />
          );
        }
        return (
          <FlexContainer align="center">
            <BasicLink to={`/elements/${sector}/faction/${key}`}>
              {name}
            </BasicLink>
            {icon}
          </FlexContainer>
        );
      },
      width: 150,
    },
    {
      accessor: 'type',
      Header: 'misc.factionCategories',
      Cell: category =>
        formatOptionalMessage(intl, category, key => `faction.category.${key}`),
      centered: true,
      width: 75,
    },
    {
      accessor: 'hitPoints',
      Header: 'misc.hitPoints',
      centered: true,
      width: 75,
    },
    {
      accessor: 'balance',
      Header: 'misc.balanceIncome',
      Cell: (balance, { income }) => {
        let incomeElement;
        if (income) {
          incomeElement = (
            <Fragment>
              <RotateCcw size={12} className="FactionTable-Income" />
              {income}
            </Fragment>
          );
        }
        return (
          <FlexContainer align="center" justify="center">
            {income ? `${balance} / ` : balance}
            {incomeElement}
          </FlexContainer>
        );
      },
      centered: true,
      width: 75,
    },
    {
      accessor: 'homeworld',
      Header: 'misc.homeworld',
      Cell: loc =>
        loc.link ? <BasicLink to={loc.link}>{loc.name}</BasicLink> : '-',
      centered: true,
      width: 100,
    },
    {
      accessor: 'experience',
      Header: 'misc.experience',
      centered: true,
      width: 75,
    },
    {
      accessor: 'goal',
      Header: 'misc.goal',
      Cell: goal =>
        goal !== '-'
          ? intl.formatMessage({ id: `faction.goal.${goal}` })
          : goal,
      centered: true,
      width: 125,
    },
    {
      accessor: 'tags',
      Header: 'misc.tags',
      Cell: tags =>
        isArray(tags)
          ? tags
              .map(tag => intl.formatMessage({ id: `faction.tags.${tag}` }))
              .join(', ') || '-'
          : '-',
      centered: true,
      width: 250,
    },
  ];

  return columnConfig.reduce(
    ({ columns, total }, { width, ...column }) => {
      if (windowWidth < total + width) {
        return { columns, total };
      }
      return { columns: [...columns, column], total: total + width };
    },
    { columns: [], total: 0 },
  ).columns;
};

export default class FactionTable extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    isSaved: PropTypes.bool.isRequired,
    isInitialized: PropTypes.bool.isRequired,
    doesNotExist: PropTypes.bool.isRequired,
    table: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    children: PropTypes.node.isRequired,
    currentSector: PropTypes.string.isRequired,
    currentFaction: PropTypes.shape({}),
    currentElement: PropTypes.string,
    toSafeRoute: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentFaction: undefined,
    currentElement: undefined,
  };

  componentDidUpdate({ isInitialized }) {
    if (!isInitialized && this.props.isInitialized && this.props.doesNotExist) {
      this.props.toSafeRoute();
    }
  }

  get isSidebarOpen() {
    const { currentFaction, currentElement } = this.props;
    return !!currentFaction || !!currentElement;
  }

  renderHeaderActions() {
    const { intl, currentSector, table, isLoggedIn } = this.props;
    if (!isLoggedIn) {
      return null;
    }
    return (
      <FlexContainer>
        <ButtonLink to={`/elements/${currentSector}/faction/new`} minimal>
          <FormattedMessage id="misc.createFaction" />
        </ButtonLink>
        {table.length && (
          <Button minimal className="FactionTable-ExportOption">
            <FormattedMessage
              id="misc.exportEntity"
              values={{ entity: intl.formatMessage({ id: 'misc.factions' }) }}
            />
          </Button>
        )}
      </FlexContainer>
    );
  }

  renderEmptyState() {
    const { table } = this.props;
    if (table.length) {
      return null;
    }
    return (
      <FlexContainer justify="center" className="FactionTable-Empty">
        <FormattedMessage id="misc.emptyFactionTable" />
      </FlexContainer>
    );
  }

  render() {
    const {
      isLoading,
      isSaved,
      table,
      intl,
      children,
      currentSector,
    } = this.props;

    if (isLoading) {
      return <Loading />;
    } else if (!isSaved) {
      return <FactionNotSaved />;
    }

    return (
      <div
        className={classNames('FactionTable', {
          'FactionTable--sidebarOpen': this.isSidebarOpen,
        })}
      >
        <FlexContainer
          className="FactionTable-Header"
          justify="spaceBetween"
          align="flexEnd"
        >
          <Header type={HeaderType.header2} noMargin>
            <FormattedMessage id="misc.factions" />
          </Header>
          {this.renderHeaderActions()}
        </FlexContainer>
        <Measure>
          {({ measureRef, contentRect }) => (
            <div ref={measureRef} className="FactionTable-Table">
              <CollapsibleTable
                dataIdAccessor="key"
                columns={buildFactionTableColumns({
                  windowWidth: contentRect.entry.width,
                  sector: currentSector,
                  intl,
                })}
                data={table}
              />
              {this.renderEmptyState()}
            </div>
          )}
        </Measure>
        <div className="FactionTable-Sidebar">{children}</div>
      </div>
    );
  }
}
