import 'react-wheel/dist/index.modern.css'

import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  ConfigProvider,
  Descriptions,
  Empty,
  List,
  Row,
  Statistic,
  Tabs,
  Typography,
} from 'antd'
import { Countdown, GetStarted, History } from '../../components'
import { PocketProps, Wheel } from 'react-wheel'
import {
  QuestionOutlined,
  ThunderboltOutlined,
  ThunderboltTwoTone,
} from '@ant-design/icons'
import React, {
  Component,
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Spring, animated } from 'react-spring'
import { increaseBalance, setOffset } from '../app/actions'
import { loadInstance, loadRoulette, setDisabled } from './actions'
import {
  selectBets,
  selectCountdownDuration,
  selectDisabled,
  selectEndDuration,
  selectEnded,
  selectInstance,
  selectInstanceValue,
  selectInstances,
  selectJackpot,
  selectJackpotInstance,
  selectJackpotValue,
  selectLoading,
  selectPlayers,
  selectSatoshi,
  selectSpinDuration,
  selectSpinning,
  selectSpins,
  selectSpun,
  selectStartedAt,
  selectWaiting,
  selectWinningNumber,
  selectWinningType,
} from './selectors'
import {
  selectError,
  selectOffset,
  selectTheme,
  selectUser,
} from '../app/selectors'
import { setChat, setRoom } from '../chat/actions'

import { BetForm } from '../../forms'
import { NextSeo } from 'next-seo'
import { UserAstronaut } from 'styled-icons/fa-solid'
import { betTypes } from '../../common'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import getConfig from 'next/config'
import moment from 'moment'
import { outcome } from '@lightning-jackpot/common'
import { show } from 'redux-modal'

// import GreenLayout from '../../components/layouts/green';

const valueToColor = (value: number, spun: boolean) =>
  value !== 0 && spun ? (value > 0 ? 'green' : 'red') : 'inherit'

const renderEmpty = image => (
  <Empty
    image={React.createElement(image, { height: '40px' })}
    imageStyle={{
      height: 40,
    }}
    style={{ height: '100%', margin: 'auto' }}
    description={<span>No Bets</span>}
  />
)

const totalValue = bets => bets.map(b => b.value).reduce((a, b) => a + b, 0)

const {
  publicRuntimeConfig: {
    APP_URL,
    ROULETTE_COUNTDOWN_DURATION,
    ROULETTE_SPIN_DURATION,
    ROULETTE_END_DURATION,
  },
} = getConfig()

export const Bear = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 338.54 327.33">
    <title>Bear</title>
    <path
      d="M169.27,322,167,320.75a342,342,0,0,1-74.25-54.92,387.7,387.7,0,0,1-49.61-60.09C18,168.22,7.17,138.85,6.72,137.62l-1.39-3.83,3.12-2.62s6.23-5.56,16.82-22.11C23,102.65,13.72,74.23,16.36,51.51l.12-1.07.5-1c.68-1.31,16.91-32.32,29-42l2.6-2.1L51.66,6.5c.25.1,25.48,9.41,49.21,9.41,1.2,0,2.38,0,3.53-.07,10.54-5.52,17.27-8.32,18-8.62l1.65-.68,45.21,9.54,45.2-9.54,1.65.68c.75.3,7.48,3.1,18,8.62,1.15.05,2.33.07,3.53.07,23.73,0,49-9.31,49.21-9.41L290,5.33l2.59,2.1c12.06,9.73,28.28,40.74,29,42.05l.5,1,.12,1.07c2.64,22.72-6.67,51.14-8.92,57.55,10.6,16.55,16.79,22.07,16.86,22.13l3.08,2.6-1.39,3.83c-.44,1.23-11.22,30.6-36.42,68.12a387.65,387.65,0,0,1-49.6,60.09,342.28,342.28,0,0,1-74.25,54.92Z"
      fill="#191a1d"
    />
    <path
      d="M51.12,40.72l.16,0a33.32,33.32,0,0,0,24.1-5c5.73-3.76,12.75-8.3,16.76-10.63-18.58-1.42-35.83-6.89-41.72-8.92C46.3,20.08,41,27.36,34.8,37.4c-4.47,7.31-8,13.9-9.07,15.88C24,69.86,29.38,90.4,32.54,100.65,33.51,57.92,51.12,40.72,51.12,40.72ZM128,205.53c2.82,4.29,38.36-6.48,38.36-6.48h0a8,8,0,0,0-6.8-7.9L150,189.73l-.56-.51a58.22,58.22,0,0,1-13.84-18.65l-.39-.93.34-.95c5.34-14.67,16.6-25.61,17.07-26.07l1.06-1,6.9,2a31.4,31.4,0,0,0,17.3,0l6.9-2,1.05,1c.48.46,11.74,11.4,17.07,26.07l.35.95-.39.93a58.4,58.4,0,0,1-13.84,18.65l-.56.51L179,191.15a8,8,0,0,0-6.81,7.9h0s35.55,10.77,38.36,6.48c4.82-7.33,7.9-19.54,8.57-22.14l-11.56-20.62-.06-.26c0-.14.22-25-9.58-44.61-4.4-8.8-17.82-24.05-17.94-24.21a56.29,56.29,0,0,1,9.79,3,15.26,15.26,0,0,0,14-1l.07,0c6-3.64,9-5.35,11.81-4.3s10.25,7.25,17.61,13.65a15.65,15.65,0,0,0,23.53-3.41,61.58,61.58,0,0,0,5.64-11.55,131.16,131.16,0,0,0-42.25-34.31,20.86,20.86,0,0,0-20.62,1L169.38,75.82V76l-.11-.07-.11.07v-.14L139,56.75a20.86,20.86,0,0,0-20.62-1A131.16,131.16,0,0,0,76.13,90.09a61.58,61.58,0,0,0,5.64,11.55,15.65,15.65,0,0,0,23.53,3.41c7.35-6.4,14.93-12.65,17.61-13.65s5.8.66,11.81,4.3l.07,0a15.25,15.25,0,0,0,14,1,56.29,56.29,0,0,1,9.79-3c-.12.16-13.54,15.41-17.94,24.21-9.8,19.58-9.56,44.47-9.59,44.61l0,.26-11.56,20.62C120.09,186,123.17,198.2,128,205.53Zm70.44,10.13s-14.21-5.44-19.06-7a33.55,33.55,0,0,0-20.2,0c-4.74,1.38-19.07,7-19.07,7l18.51,7.72a24.19,24.19,0,0,0,21.32,0ZM300.69,106.82c-13-21.69-31.08-54.7-34-60.12a347.57,347.57,0,0,0-35.19-21.49,2.8,2.8,0,0,1-1-.5c-8.54-4.5-14.68-7.26-17-8.26l-44.14,9v.05l-.11,0-.11,0v-.05l-44.15-9c-2.31,1-8.45,3.76-17,8.26a2.73,2.73,0,0,1-1,.5A347.57,347.57,0,0,0,71.88,46.7c-3,5.42-21,38.43-34,60.12-10.62,17.7-18,26.32-21.34,29.75,3,7.48,13.92,33.2,34.66,64.06a378.78,378.78,0,0,0,48.36,58.53,327,327,0,0,0,66.76,50.9c-16.86-19.2-84.64-102.3-78.06-190.25-14.46-11.1-19.52-28.64-19.75-29.45L68,88.57l1.14-1.46C94.91,53.93,127.58,43.68,129,43.26l1.57-.48,3.84,2.4a66,66,0,0,0,69.79,0l3.85-2.4,1.57.48c1.37.42,34,10.67,59.84,43.85l1.13,1.46-.5,1.79c-.22.81-5.28,18.35-19.74,29.45,6.58,87.95-61.2,171.05-78.06,190.25A327.23,327.23,0,0,0,239,259.16a378.78,378.78,0,0,0,48.36-58.53c20.74-30.86,31.68-56.58,34.65-64.06C318.72,133.14,311.31,124.52,300.69,106.82ZM159.51,160.49c5.09-.39,9.06,8,9.76,10.24.7-2.2,4.67-10.63,9.76-10.24,5.62.43,11.67,7,12.11,9s-5,12.76-5,12.76c6.74-6.29,10.41-10.37,11.57-12.75-4.12-10.62-11.69-19.21-14.41-22.08l-7.54,2a26.15,26.15,0,0,1-13.15,0l-7.33-1.93c-2.72,2.87-10.29,11.46-14.42,22.08,1.17,2.38,4.83,6.46,11.57,12.75,0,0-5.44-10.74-5-12.76S153.89,160.92,159.51,160.49ZM285.79,41c.58-.07,1.12-.16,1.62-.25,0,0,17.62,17.2,18.59,59.93,3.16-10.25,8.52-30.79,6.81-47.37-1.05-2-4.6-8.57-9.07-15.88-6.15-10-11.5-17.32-15.62-21.24-5.89,2-23.14,7.5-41.72,8.92,4.06,2.36,11.17,6.94,16.92,10.69A33.39,33.39,0,0,0,285.79,41Z"
      fill="#f5222d"
    />
    <path
      d="M134.68,113.15l-11.35-4.76c-1.73,1.3-1.3,10.16,5.41,10.16S134.68,113.15,134.68,113.15Z"
      fill="#ebe4d1"
    />
    <path
      d="M215.21,108.39l-11.35,4.76s-.76,5.4,5.94,5.4S216.94,109.69,215.21,108.39Z"
      fill="#ebe4d1"
    />
  </svg>
)

export const Moon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 235.45519 235.4553"
  >
    <defs>
      <linearGradient
        id="a"
        x1="73.89211"
        y1="18.46789"
        x2="150.61346"
        y2="192.19343"
        gradientTransform="translate(117.72765 -48.76435) rotate(45)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#8d8d8e" />
        <stop offset="0.54123" stopColor="#ababab" />
        <stop offset="1" stopColor="#c7c7c7" />
      </linearGradient>
      <linearGradient
        id="b"
        x1="141.2907"
        y1="227.28701"
        x2="199.04727"
        y2="85.05045"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#ddd" />
        <stop offset="1" stopColor="#cdcccc" />
      </linearGradient>
    </defs>
    <title>Moon</title>
    <g style={{ isolation: 'isolate' }}>
      <circle
        cx="117.7276"
        cy="117.72767"
        r="117.7276"
        transform="translate(-48.76442 117.72762) rotate(-45)"
        fill="url(#a)"
      />
      <path
        d="M230.95449,117.7277A113.22688,113.22688,0,0,1,117.7276,230.9546c-9.5588,0-21.4613-.43-30.2032-4.704,17.5829-.4641,35.7481-1.1462,52.0763-7.686,21.7677-8.7185,22.7374-23.5813,33.0342-34.4834,3.1399-3.3245,7.3936-7.3493,10.7155-10.4918,7.4059-7.006,1.9396-17.9608,10.9482-29.3572,2.069-2.6174,5.16-4.2653,8.07359-5.8909,26.5586-14.8185,22.1372-47.2616,21.77441-58.0387C229.55209,91.4984,230.95449,105.3974,230.95449,117.7277Z"
        opacity="0.52"
        fill="url(#b)"
      />
      <path
        d="M76.3696,70.1655c4.5952,6.5276,1.357,16.7213-7.2327,22.7682s-19.2784,5.6574-23.8736-.8701-1.357-16.7213,7.2328-22.7682S71.7744,63.638,76.3696,70.1655Z"
        fill="#999"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <ellipse
        cx="24.82995"
        cy="105.69687"
        rx="12.41533"
        ry="9.43463"
        transform="translate(-81.60503 84.25041) rotate(-65.38753)"
        fill="#999"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M31.5972,121.8183c2.6968,1.2353,3.565,5.1136,1.9394,8.6623s-5.1297,5.424-7.8264,4.1886-3.565-5.1136-1.9394-8.6623S28.9005,120.5829,31.5972,121.8183Z"
        fill="#999"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M106.9953,22.4676c.6556,3.078-2.9714,6.4589-8.101,7.5514s-9.8195-.517-10.4751-3.595,2.9714-6.4589,8.1011-7.5515S106.3398,19.3896,106.9953,22.4676Z"
        fill="#999"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M80.2264,31.1025c3.1003,3.8072-1.2315,12.4676-9.6754,19.3436s-17.8022,9.3638-20.9024,5.5567,1.2315-12.4676,9.6754-19.3436S77.1262,27.2953,80.2264,31.1025Z"
        fill="#999"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <ellipse
        cx="29.59995"
        cy="63.72942"
        rx="13.8343"
        ry="6.23762"
        transform="translate(-40.4615 58.34526) rotate(-60.69239)"
        fill="#999"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M202.6016,36.621c.11289.0858.29379.0142.43739.0271A117.72782,117.72782,0,0,0,11.5365,168.6023c-.3158-3.7725-1.3764-7.5735-2.0531-11.3299-3.301-18.3204-3.5743-40.9178,4.4058-57.6228,8.2674-17.3064,22.8233-9.3289,23.9547-1.126.185,1.3411.6466-2.4531.9262-12.715C39.067,74.913,47.529,64.8262,56.8835,62.2772c33.9053-9.2388,39.6796-42.7661,14.8774-39.7899C116.0741,1.3228,170.6389,12.346,202.6016,36.621Z"
        fill="#999"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M170.3578,198.5891c.5583,13.4247,25.1274,1.9465,25.2797-11.2714C195.8565,168.322,170.0065,190.1424,170.3578,198.5891Z"
        fill="#d1d0d1"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M193.5302,156.7755c-.07,10.4465,17.22369-1.5053,15.51829-9.4692C206.30149,134.4787,193.5784,149.5753,193.5302,156.7755Z"
        fill="#dbdbdb"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M199.18069,171.9265c-3.83139,10.2669,14.773,5.1216,12.91991-4.3705C210.34989,158.5877,201.02829,166.9754,199.18069,171.9265Z"
        fill="#dbdbdb"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M112.3218,112.5344c-2.9049,33.7025,39.8614,29.6674,47.5162,3.5033C169.6031,82.6603,115.1415,79.8215,112.3218,112.5344Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M198.02939,53.0384c6.4949-1.9808-6.48279-14.59-11.09439-15.1857C178.0528,36.7053,192.2632,52.5464,198.02939,53.0384Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M127.216,172.4651c-18.8276,9.1525-34.1588-14.8349-16.6534-26.11C128.0916,135.0647,148.8927,161.9276,127.216,172.4651Z"
        fill="#bcbcbb"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M62.2801,214.0557c10.392,5.8408,35.7005,11.177,18.5404-4.7213-4.2558-3.9428-16.5029-10.9561-21.8993-9.6388C49.3544,202.0309,55.5908,210.2959,62.2801,214.0557Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M91.0877,206.7911c1.3496,4.8182,13.6999,9.1784,16.4634,4.7764C112.7806,203.2373,89.385,200.7118,91.0877,206.7911Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M51.1067,185.2399c-1.9916,7.1498,20.0571,16.3205,21.3957,7.9142C73.7255,185.4734,53.6487,176.1141,51.1067,185.2399Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M33.2638,185.9624c-5.9945.0916,6.1372,11.6522,8.9345,12.2734C50.2739,200.0291,42.2521,185.8252,33.2638,185.9624Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M201.57989,65.1714c-.65129,9.2234,14.067,24.5093,14.33771,7.4923C216.01669,66.4292,202.43819,53.0167,201.57989,65.1714Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M182.9043,60.5662c.5815,7.2226,12.7013,16.9238,11.5125,3.7033C193.8248,57.6861,182.0612,50.0938,182.9043,60.5662Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M150.2075,144.9234a8.08058,8.08058,0,0,0,.4285,3.5632,8.90314,8.90314,0,0,0,3.6587,3.7039c3.1158,2.0228,6.9446,3.7684,10.4421,2.5166a8.42571,8.42571,0,0,0,4.5425-4.2877,14.89541,14.89541,0,0,0,1.3502-6.2084,10.33149,10.33149,0,0,0-.8716-4.97,8.96088,8.96088,0,0,0-4.5834-3.9447C156.9489,131.7682,150.6743,136.4035,150.2075,144.9234Z"
        fill="#cdcccc"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M54.8142,136.6346c-4.4399,9.8705,10.6925,26.076,18.8671,16.2528C82.6346,142.1285,59.4388,126.3537,54.8142,136.6346Z"
        fill="#bcbcbb"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M121.9988,48.9647c-5.9647,9.6554,16.1191,18.3186,22.2963,9.5665C152.6281,46.7247,130.5991,35.0427,121.9988,48.9647Z"
        fill="#a8a7a7"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
      <path
        d="M140.2995,35.4291c-4.721,4.1565,6.8991,7.7893,8.9348,6.1192C152.3813,38.9663,145.3129,31.0151,140.2995,35.4291Z"
        fill="#bcbcbb"
        opacity="0.43"
        style={{ mixBlendMode: 'multiply' }}
      />
    </g>
  </svg>
)

export const Bull = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 362.13 327.33">
    <title>Bull</title>
    <path
      d="M181.06,322.33l-2.1-1.26a349.91,349.91,0,0,1-81.33-67.34c-18.55-20.88-28.58-36.59-29-37.24l-1-1.66.23-1.94c5.4-44.13,18.49-72.1,21.61-78.28a105.9,105.9,0,0,1,1.4-15l-12.51,2.64-1.63-.73C63,115.38,32,91.07,30.68,90l-6.3-5L31.28,81c1.14-.67,2.28-1.32,3.43-2a57,57,0,0,1-15.43-4.61C10.36,70.22,5,62.5,5,53.8c0-7.6,4.1-22.36,31.83-35.69C61.43,6.28,86,5,95.38,5c3.08,0,5,.13,5.29.15a5.47,5.47,0,0,1,1.15,10.71A422.38,422.38,0,0,0,61.48,30.5C51.23,34.88,47.57,39,46.67,40.63c1,.44,3.23,1.07,7.35,1.07h1.12C74.4,41.2,112.83,34,118.3,32.93L123,26.67,166.61,16.5l14.45,6.21,14.46-6.21,43.56,10.17,4.75,6.26c5.46,1,43.9,8.27,63.16,8.76h1.12c4.11,0,6.38-.63,7.35-1.07-.9-1.64-4.56-5.75-14.81-10.13A424.13,424.13,0,0,0,260.3,15.86a5.48,5.48,0,0,1,1.15-10.71c.35,0,2.21-.15,5.29-.15,9.41,0,34,1.28,58.56,13.11,12.05,5.79,20.84,12.43,26.13,19.71,4.72,6.51,5.7,12.29,5.7,16,0,8.7-5.36,16.42-14.29,20.66a57,57,0,0,1-15.42,4.61q1.72.95,3.42,2l6.9,4.06-6.3,5c-1.31,1-32.29,25.34-46,31.49l-1.63.73-12.52-2.64a104.46,104.46,0,0,1,1.41,15c3.12,6.17,16.21,34.14,21.6,78.28l.24,1.94-1.05,1.66c-.42.65-10.46,16.36-29,37.24a350.17,350.17,0,0,1-81.34,67.34Z"
      fill="#191a1d"
    />
    <path
      d="M199.16,217.8c7.64,1.73,13,.39,14.52-.1,7.84-9.38,9.44-21.44,9.62-28.61a11.43,11.43,0,0,0-5.06-9.78,29.12,29.12,0,0,0-15.46-4.7c-7,9.82-20.06,10.69-21.64,10.76H181c-1.58-.07-14.61-.94-21.64-10.76a29.15,29.15,0,0,0-15.47,4.7,11.45,11.45,0,0,0-5.06,9.78c.18,7.17,1.79,19.23,9.63,28.61,1.56.49,6.88,1.83,14.52.1,6.75-1.53,16.67-2,18-2.08h.15C182.48,215.78,192.41,216.27,199.16,217.8ZM195,191.53c7-10.36,22.3-6.08,22.3-6.08-3.92.4-7,3.92-7,3.92a11,11,0,0,1-3.38,11.21c2.84-.27,6.9-3.11,6.9-3.11C206.22,212.74,186.56,203.93,195,191.53Zm-46.6,5.94s4,2.84,6.89,3.11a11,11,0,0,1-3.38-11.21s-3.1-3.52-7-3.92c0,0,15.26-4.28,22.29,6.08C175.56,203.93,155.9,212.74,148.37,197.47ZM131,56.43c0,.28,0,.56,0,.83a7.29,7.29,0,0,0,7.55,7.85,51.41,51.41,0,0,1,5.38.09s-19,5.44-25.78,13.43c-4.4,5.17-15.63,19.93-18.9,44.71a16.77,16.77,0,0,0,7.52,16.25l15,9.73,15.9,28.73a32.6,32.6,0,0,1,19.74-8.24s-40.65-60.54-46-62.64l24.41.72,6.16,4,.64-21.36,20,80.16.14.2c5.51,8.79,17.33,9.56,18.33,9.6s12.83-.81,18.34-9.6l.13-.2,20-80.16.64,21.36,6.16-4,24.41-.72c-5.36,2.1-46,62.64-46,62.64a32.58,32.58,0,0,1,19.73,8.24l15.91-28.73,12-7.77A22.32,22.32,0,0,0,262.24,119C258.31,96.81,248.15,83.49,244,78.63c-6.79-8-25.78-13.43-25.78-13.43a51.45,51.45,0,0,1,5.38-.09,7.29,7.29,0,0,0,7.56-7.85c0-.27,0-.55,0-.83-.44-10.18,2.51-16.16,4.77-19.2l-2-2.61L200,26.7a12.78,12.78,0,0,0-7.27.42l-11.49,4.14v.11l-.15-.05-.14.05v-.11l-11.49-4.14a12.78,12.78,0,0,0-7.27-.42l-34,7.92-2,2.61C128.5,40.27,131.45,46.25,131,56.43ZM271.4,74.78c-8.49.66-15.63,8.53-13.86,11.68,5.78-1.5,26.61-6.24,43-1.4L289.33,96.85a45,45,0,0,1-22.27,12.76l15.73,3.32c10.29-5,30.41-20.11,39-26.73C301.18,75.22,283.18,73.87,271.4,74.78Zm-5.52,68.94L259,147.29a49.42,49.42,0,0,0-20.61,20h0a28.51,28.51,0,0,0,1.19,29.53c7,10.68,10.44,20,12,30.34a26.53,26.53,0,0,1-5.36,20.12,438.3,438.3,0,0,1-63.47,65.79c62.08-39.58,96.46-90.76,101.84-99.15.32-.47.59-.87.8-1.2a270.85,270.85,0,0,0-12.65-54.86C269.92,150,267.44,147,265.88,143.72ZM321.44,26.15a124.64,124.64,0,0,0-33.77-10.41c5.2,1.94,10.82,4.15,16.48,6.56C318.32,28.36,325.9,36,324.42,42.77c-.43,2-1.84,4.68-6.14,6.34a30.52,30.52,0,0,1-11.52,1.49c-21.39-.54-64.59-9.07-64.65-9.09-1.45,2-3.65,6.5-3.29,14.62.37,8.51,20.75,12.71,31.67,11.81a92.52,92.52,0,0,1,30.15,2.66,3.4,3.4,0,0,1,1.46-.09c.22,0,21.56,3.2,36.91-4.1,5.84-2.77,9.19-7.38,9.2-12.63C348.23,44.41,338.47,34.34,321.44,26.15ZM202.81,224a39.39,39.39,0,0,1-4.73-.78,166.07,166.07,0,0,0-17-2.62,166.48,166.48,0,0,0-17,2.62,39.24,39.24,0,0,1-4.72.78l5.26,6.33S169,233,181.06,233s16.48-2.7,16.48-2.7ZM60,70.51a3.45,3.45,0,0,1,1.47.09,92.47,92.47,0,0,1,30.14-2.66c10.92.9,31.31-3.3,31.68-11.81.35-8.12-1.84-12.58-3.3-14.62-.05,0-43.26,8.55-64.65,9.09a30.46,30.46,0,0,1-11.51-1.49c-4.3-1.66-5.72-4.37-6.15-6.34C36.23,36,43.81,28.36,58,22.3c5.66-2.41,11.28-4.62,16.47-6.56A124.69,124.69,0,0,0,40.69,26.15c-17,8.19-26.79,18.26-26.77,27.63,0,5.25,3.36,9.86,9.19,12.63C38.46,73.71,59.81,70.54,60,70.51Zm35,39.1A45.06,45.06,0,0,1,72.79,96.85L61.56,85.06c16.41-4.84,37.24-.1,43,1.4,1.76-3.15-5.37-11-13.87-11.68C79,73.87,60.94,75.22,40.29,86.2c8.64,6.62,28.76,21.72,39.05,26.73Zm15.58,117.53c1.52-10.31,4.92-19.65,12-30.32a28.51,28.51,0,0,0,1.2-29.53h0a49.42,49.42,0,0,0-20.61-20l-6.94-3.57c-1.55,3.32-4,6.32-6.77,14.14a272.23,272.23,0,0,0-12.65,54.86l.8,1.2c5.38,8.39,39.76,59.57,101.85,99.15A457.27,457.27,0,0,1,116,247.29,26.52,26.52,0,0,1,110.64,227.14Z"
      fill="#52c41a"
    />
    <path
      d="M229.1,121.58c2.81-.54,4.56-1.92,5.35-4.22a15.88,15.88,0,0,0,.45-3.7l-7,1.11-6.37,4.35C222.52,120.47,224.79,122.42,229.1,121.58Z"
      fill="#ebe4d1"
    />
    <path
      d="M127.22,113.66a15.93,15.93,0,0,0,.46,3.7c.79,2.3,2.54,3.68,5.34,4.22,4.32.84,6.58-1.11,7.59-2.46l-6.38-4.35Z"
      fill="#ebe4d1"
    />
  </svg>
)

export const Lightning = (
  <ThunderboltTwoTone
    title="Lightning"
    twoToneColor="#722ed1"
    style={{ width: '100%', height: '100%' }}
  />
)

const images = {
  bear: Bear,
  moon: Moon,
  bull: Bull,
  lightning: Lightning,
}
// console.log('images', images);

const colors = {
  bear: '#f5222d',
  moon: '#000000',
  bull: '#73d13d',
  lightning: '#722ed1',
}
// console.log('images', images);

const pockets: PocketProps[] = [
  {
    id: 0,
    name: 'moon',
    image: images.moon,
    color: colors.moon,
  },
  ...Array.from(Array(14), (n, index) => index + 1).reduce(
    (previousValue, currentValue) => {
      return [
        ...previousValue,
        currentValue % 2
          ? {
              id: currentValue,
              name: 'bear',
              image: images.bear,
              color: colors.bear,
            }
          : {
              id: currentValue,
              name: 'bull',
              image: images.bull,
              color: colors.bull,
            },
      ]
    },
    []
  ),
  {
    id: 15,
    name: 'lightning',
    image: images.lightning,
    color: colors.lightning,
  },
]

// const getTotalValue = list => {
//   if (list.length) {
//     const reducer = (accumulator, currentValue) => accumulator + currentValue;
//     const valueList = list.map(bet => bet.value);
//     return valueList.reduce(reducer);
//   }
//   return 0;
// };

function RouletteContainer(props) {
  const {
    bets,
    countdownDuration,
    endDuration,
    increaseBalance,
    instances,
    instance,
    instanceValue,
    jackpot,
    jackpotInstance,
    jackpotValue,
    offset,
    loading,
    players,
    satoshi,
    setDisabled,
    show,
    spins,
    spinDuration,
    startedAt,
    winningNumber,
    winningType,
    pageTransitionReadyToEnter,
    loadInstance,
    loadRoulette,
    user,
    waiting,
    ended,
  } = props

  const [tab, setTab] = useState('default')

  const handleTab = tab => {
    setTab(tab)
  }

  const now = () => moment().valueOf() + offset

  const [spinning, setSpinning] = useState(props.spinning)

  const [spun, setSpun] = useState(props.spun)

  const spinTimeout = useRef(0)
  const resetTimeout = useRef(0)

  useEffect(() => {
    console.log('Load roulette...')
    loadRoulette()
  }, [loadRoulette])

  useEffect(() => {
    if (props.spinning) {
      setSpinning(true)
    }
    if (props.spun) {
      setSpun(true)
    }
  }, [props.spinning, props.spun])

  useEffect(() => {
    return () => {
      // console.log('Clear Spin Timeout', spinTimeout)
      clearTimeout(spinTimeout.current)

      // console.log('Clear Reset Timeout', resetTimeout)
      clearTimeout(resetTimeout.current)
    }
  }, [])

  const spinTimeoutHandler = useCallback(() => {
    // console.log('Spin Timeout Handler')
    setSpun(true)
    if (user) {
      bets
        .filter(bet => bet.getIn(['user', 'id']) === user.get('id'))
        .forEach(bet => {
          const value = outcome(
            bet.getIn(['state', 'type']),
            bet.get('value'),
            winningType === bet.getIn(['state', 'type']),
            instanceValue,
            jackpotInstance,
            jackpotValue
          )
          if (value > 0) {
            increaseBalance(Math.floor(value))
          }
        })
    }
  }, [
    bets,
    increaseBalance,
    instanceValue,
    jackpotInstance,
    jackpotValue,
    user,
    winningType,
  ])

  const resetTimeoutHandler = useCallback(() => {
    // console.log('Reset Timeout Handler')
    setSpinning(false)
    setSpun(false)
    spinTimeout.current = 0
    resetTimeout.current = 0
    setDisabled(false)
  }, [setDisabled])

  useEffect(() => {
    if (Number.isInteger(winningNumber)) {
      if (!spun) {
        // console.log('Set Disabled')
        setDisabled(true)

        // console.log('Set Spinning')
        setSpinning(true)

        // console.log('Set Spin Timeout', spinDuration * 1000)
        spinTimeout.current = window.setTimeout(
          spinTimeoutHandler,
          spinDuration * 1000
        )
      } else if (!resetTimeout.current) {
        // console.log('Set Reset Timeout', endDuration * 1000 + 1000)
        resetTimeout.current = window.setTimeout(
          resetTimeoutHandler,
          endDuration * 1000 + 1000
        )
      }
    }
  }, [
    endDuration,
    resetTimeoutHandler,
    setDisabled,
    spinDuration,
    spinTimeoutHandler,
    spun,
    winningNumber,
  ])

  const onSpin = () => {
    // console.log('onSpin', { spinning, p: props.spinning });
  }

  const onSpun = () => {
    // console.log('onSpun', { spun, p: props.spun});
  }

  if (loading) {
    return null
  }

  return (
    <div className="roulette" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <NextSeo title="Roulette" description="Roulette by Lightning Jackpot" />
      {user && user.get('balance') < 1000 && <GetStarted />}
      <Card
        title={
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>
              <a href="">Roulette</a>
            </Breadcrumb.Item>
          </Breadcrumb>
          // <>
          //   Roulette - <a>Tutorial</a>
          // </>
        }
        extra={
          <>
            <ThunderboltTwoTone twoToneColor="#722ed1" /> Jackpot:{' '}
            {jackpotValue}{' '}
            <a onClick={show('jackpot')}>
              <QuestionOutlined />
            </a>
          </>
        }
        size="small"
      >
        <div style={{ position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 2,
            }}
          >
            <Countdown
              id={startedAt}
              date={startedAt * 1000}
              waiting={waiting}
              now={now}
              visible={!Number.isInteger(winningNumber) && !spun}
            />
          </div>
          <Wheel
            delay={0}
            direction="backwards"
            spinDuration={spinDuration * 1000}
            layout="horizontal"
            onSpin={onSpin}
            onSpun={onSpun}
            pockets={pockets}
            start={15}
            winner={winningNumber}
            noLine={!Number.isInteger(winningNumber)}
            // overlay={
            //   <Countdown
            //     id={startedAt}
            //     date={startedAt * 1000}
            //     waiting={waiting}
            //     now={now}
            //     visible={!Number.isInteger(winningNumber) && !spun}
            //   />
            // }
          />
        </div>
      </Card>

      {/* <Descriptions
        bordered
        size="small"
        column={2}
        colon={true}
        layout="horizontal"
        style={{ margin: "24px 0" }}
      >
        <Descriptions.Item label="Server 🌱 (SHA256 Hash)">
          <Typography.Text ellipsis={true} copyable={true}>
            124a64e4387bf1b6bd3b7c0ae5b4fbf31f6d3dcf673c3cda6b9225f901ba5309
          </Typography.Text>
        </Descriptions.Item>
        <Descriptions.Item label="Client 🌱">
          <Typography.Text ellipsis={true} copyable={true}>
            33803528
          </Typography.Text>
        </Descriptions.Item>
      </Descriptions> */}

      <Row style={{ margin: '24px 0' }}>
        <Col xs={0} sm={24}>
          <Card style={{ background: '#fafafa' }}>
            <BetForm />
          </Card>
        </Col>
        <Col xs={24} sm={0} style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            size="large"
            onClick={show('play')}
            block={true}
          >
            Play
          </Button>
        </Col>
      </Row>
      <Row gutter={24}>
        {Object.entries(betTypes)
          .slice(0, 3)
          .map(([type, { color, image, multiplier }]) => {
            const filteredBets = bets.filter(
              bet => bet.getIn(['state', 'type']) === type
            )
            const groupedBets = filteredBets
              .groupBy(bet => bet.get('user'))
              .mapEntries(([k, v]) => [
                k,
                {
                  id: k.get('id'),
                  type,
                  user: k,
                  value: v
                    .map(entry => entry.get('value'))
                    .reduce((a, b) => a + b, 0),
                },
              ])
              .toList()
            const winner = winningType === type
            const total = !spun
              ? totalValue(groupedBets)
              : outcome(
                  type,
                  totalValue(groupedBets),
                  winner,
                  instanceValue,
                  jackpotInstance,
                  jackpotValue
                )
            return (
              <Col key={`bets-${type}`} xs={24} sm={24} md={8}>
                <Card
                  bodyStyle={{
                    padding: 0,
                    marginBottom: 16,
                  }}
                  bordered={false}
                >
                  <ConfigProvider renderEmpty={() => renderEmpty(image)}>
                    <List
                      size="small"
                      style={{
                        borderTop: `2px solid ${color}`,
                      }}
                      header={
                        <div style={{ display: 'flex' }}>
                          <div
                            style={{ display: 'inline-block', width: '50%' }}
                          >
                            {type} x{multiplier}
                          </div>{' '}
                          <div
                            style={{
                              display: 'inline-block',
                              textAlign: 'right',
                              width: '50%',
                            }}
                          >
                            <UserAstronaut size={16} /> {groupedBets.size}
                          </div>
                        </div>
                      }
                      footer={
                        filteredBets.size ? (
                          <div style={{ display: 'flex' }}>
                            <div
                              style={{
                                display: 'inline-block',
                                width: '50%',
                              }}
                            >
                              {filteredBets.size} bet
                              {filteredBets.size > 1 && 's'}
                            </div>
                            <div
                              style={{
                                color: valueToColor(total, spun),
                                fontWeight:
                                  spun &&
                                  total > 0 &&
                                  (jackpotInstance || winner)
                                    ? 700
                                    : 400,
                                lineHeight: '22px',
                                display: 'inline-block',
                                width: '50%',
                                textAlign: 'right',
                              }}
                            >
                              <Spring
                                native={true}
                                from={{ total: 0 }}
                                to={{ total }}
                              >
                                {(props: any) => (
                                  <animated.div
                                    children={props.total.to(
                                      v =>
                                        `${
                                          spun && total > 0 ? '+' : ''
                                        } ${Number(
                                          v.toFixed()
                                        ).toLocaleString()} SAT`
                                    )}
                                  />
                                )}
                              </Spring>
                            </div>
                          </div>
                        ) : null
                      }
                      bordered={true}
                      dataSource={groupedBets}
                      renderItem={(bet: any) => {
                        return (
                          <List.Item key={bet.id}>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  size={22}
                                  shape="square"
                                  src={bet.user.get('avatar')}
                                  children={bet.user.get('name')}
                                  style={{
                                    backgroundColor: bet.user.get('color'),
                                    verticalAlign: 'middle',
                                  }}
                                />
                              }
                              description={bet.user.get('name')}
                            />
                            <div
                              style={{
                                color: valueToColor(total, spun),
                                fontWeight:
                                  spun && (winner || jackpotInstance)
                                    ? 700
                                    : 400,
                                lineHeight: '22px',
                              }}
                            >
                              <Spring
                                native={true}
                                from={{ value: !spun ? 0 : bet.value }}
                                to={{
                                  value: !spun
                                    ? bet.value
                                    : outcome(
                                        bet.type,
                                        bet.value,
                                        winner,
                                        instanceValue,
                                        jackpotInstance,
                                        jackpotValue
                                      ),
                                }}
                              >
                                {(props: any) => (
                                  <animated.div
                                    children={props.value.to(
                                      value =>
                                        `${
                                          spun && value > 0 ? '+' : ''
                                        } ${Number(
                                          value.toFixed()
                                        ).toLocaleString()} SAT`
                                    )}
                                  />
                                )}
                              </Spring>
                            </div>
                          </List.Item>
                        )
                      }}
                    />
                  </ConfigProvider>
                </Card>
              </Col>
            )
          })}
      </Row>

      <Row
        gutter={24}
        style={{
          textAlign: 'center',
          marginTop: '24px',
          marginBottom: '24px',
        }}
      >
        <Col xs={0} sm={8}>
          <Card bordered={false} size="small">
            <Statistic title="Players" value={players} />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} size="small">
            <Statistic title="Satoshis" value={satoshi} />
          </Card>
        </Col>
        <Col xs={0} sm={8}>
          <Card bordered={false} size="small">
            <Statistic title="Spins" value={spins} />
          </Card>
        </Col>
      </Row>

      {/* <Tabs defaultActiveKey="0" onChange={handleTab}>
        <Tabs.TabPane tab="Previous" key="0">
          <History instances={instances} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Jackpots" key="1">
          Jackpots
        </Tabs.TabPane>
      </Tabs> */}
    </div>
  )
}

RouletteContainer.pageTransitionDelayEnter = false

RouletteContainer.getInitialProps = async ({ store }) => {
  // if (store.getState().hasIn(['roulette', 'instance'])) {
  //   console.log('getInitialProps - Load instance ' + store.getState().getIn(['roulette', 'instance', 'id']))
  //   loadInstance(store.getState().getIn(['roulette', 'instance', 'id']));
  // } else {
  //   console.log('getInitialProps - Load roulette');
  //   store.dispatch(loadRoulette());
  // }
  store.dispatch(loadRoulette())
}

//instance && moment(now()).unix() < startedAt

// UNCOMMENT TO SEE EXAMPLE
// by default a DefaultLayout is wrapped around the "Page" (Roulette in this case), unless this static property is set.
// RouletteContainer.Layout = GreenLayout;

const mapStateToProps = createStructuredSelector({
  theme: selectTheme(),
  instance: selectInstance(),
  instances: selectInstances(),
  user: selectUser(),
  loading: selectLoading(),
  endDuration: selectEndDuration(),
  error: selectError(),
  startedAt: selectStartedAt(),
  jackpot: selectJackpot(),
  jackpotValue: selectJackpotValue(),
  winningNumber: selectWinningNumber(),
  winningType: selectWinningType(),
  jackpotInstance: selectJackpotInstance(),
  instanceValue: selectInstanceValue(),
  bets: selectBets(),
  offset: selectOffset(),
  players: selectPlayers(),
  spins: selectSpins(),
  satoshi: selectSatoshi(),
  disabled: selectDisabled(),
  waiting: selectWaiting(),
  spinDuration: selectSpinDuration(),
  countdownDuration: selectCountdownDuration(),
  spinning: selectSpinning(),
  spun: selectSpun(),
  ended: selectEnded(),
})

const mapDispatchToProps = dispatch => ({
  show: name => () => dispatch(show(name)),
  increaseBalance: value => dispatch(increaseBalance(value)),
  loadInstance: id => dispatch(loadInstance(id)),
  loadRoulette: () => dispatch(loadRoulette()),
  setRoom: room => dispatch(setRoom(room)),
  setChat: chat => dispatch(setChat(chat)),
  setOffset: offset => dispatch(setOffset(offset)),
  setDisabled: disabled => dispatch(setDisabled(disabled)),
})

export default connect(mapStateToProps, mapDispatchToProps)(RouletteContainer)
