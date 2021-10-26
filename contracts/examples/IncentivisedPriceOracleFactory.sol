pragma solidity =0.6.6;

import "./IncentivisedSlidingWindowOracle.sol";

// Deployments
// Rinkeby: 0xC37B12c6d8ab6336947920e9c2F4f5777F2C3450
// xDai: 0x058fAd765f4B33e3Fb9e16B37973EFC00249CbBF

contract IncentivisedPriceOracleFactory {

    event NewIncentivisedPriceOracle(IncentivisedSlidingWindowOracle incentivisedSlidingWindowOracle);

    function newIncentivisedPriceOracle(
        address _factory,
        uint _windowSize,
        uint8 _granularity,
        IERC20 _incentiveToken,
        uint256 _percentIncentivePerCall,
        address _incentivisedPair
    ) public returns (IncentivisedSlidingWindowOracle) {

        IncentivisedSlidingWindowOracle incentivisedSlidingWindowOracle = new IncentivisedSlidingWindowOracle(
            _factory,
            _windowSize,
            _granularity,
            _incentiveToken,
            _percentIncentivePerCall,
            _incentivisedPair
        );

        emit NewIncentivisedPriceOracle(incentivisedSlidingWindowOracle);

        return incentivisedSlidingWindowOracle;
    }
}
