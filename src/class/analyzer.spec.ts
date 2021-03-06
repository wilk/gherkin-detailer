import { expect } from 'chai';
import { Analyzer } from './analyzer';
import { assert, createSandbox } from 'sinon';

describe('#Analyzer', () => {
  let analyzer: Analyzer;
  const gherkin = [
    'Feature: Extension Feature',
    'Scenario: Scenario Extension Feature',
    'Given an initial state is set',
    'When an extension action is taken',
    'Then an outcome happens',
    '',
    'This line is not part of the report'
  ];

  let sandboxSet: any;

  beforeEach(() => {
    analyzer = new Analyzer();
    sandboxSet = createSandbox();
  });

  describe('#getGherkins', () => {
    it('should initialize the report folder with default one', () => {
      const expectedGherkins = {
        files: [
          'Feature: Extension Feature',
          'Scenario: Scenario Extension Feature',
          'Given an initial state is set',
          'When an extension action is taken',
          'Then an outcome happens'
        ],
        features: [
          'Extension Feature'
        ],
        scenarios: [
          'Scenario Extension Feature'
        ],
        states: [
          'an initial state is set'
        ],
        actions: [
          'an extension action is taken'
        ],
        outcomes: [
          'an outcome happens'
        ]
      };

      const gherkins = analyzer.getGherkins(gherkin);

      expect(gherkins).to.be.deep.equal(expectedGherkins);
    });

    it('should call validation methods', () => {
      const getValidFeatureStub = sandboxSet.stub(analyzer, 'getValidFeature');
      const getValidScenarioStub = sandboxSet.stub(analyzer, 'getValidScenario');
      const getValidStateStub = sandboxSet.stub(analyzer, 'getValidState');
      const getValidActionStub = sandboxSet.stub(analyzer, 'getValidAction');
      const getValidOutcomeStub = sandboxSet.stub(analyzer, 'getValidOutcome');

      analyzer.getGherkins(gherkin);

      assert.calledWith(getValidFeatureStub);
      assert.calledWith(getValidScenarioStub);
      assert.calledWith(getValidStateStub);
      assert.calledWith(getValidActionStub);
      assert.calledWith(getValidOutcomeStub);
    });
  });

  describe('#getValidFeature', () => {
    it('should return a valid feature', () => {
      const featureText = 'Create menu';
      const validFeature = `Feature: ${featureText}`;

      const expectedFeature = analyzer['getValidFeature'](validFeature);

      expect(expectedFeature).to.be.not.equal('');
      expect(expectedFeature).to.be.deep.equal(featureText);
    });

    it('should not return a valid feature', () => {
      const invalidFeature = 'This is not valid';

      const expectedFeature = analyzer['getValidFeature'](invalidFeature);

      expect(expectedFeature).to.be.deep.equal(null);
    });
  });

  describe('#getValidScenario', () => {
    it('should return a valid scenario', () => {
      const scenarioText = 'A logged user requests a new credit card';
      const validScenario = `Scenario: ${scenarioText}`;

      const expectedScenario = analyzer['getValidScenario'](validScenario);

      expect(expectedScenario).to.be.not.equal('');
      expect(expectedScenario).to.be.deep.equal(scenarioText);
    });

    it('should not return a valid feature', () => {
      const invalidScenario = 'This is not valid';

      const expectedScenario = analyzer['getValidScenario'](invalidScenario);

      expect(expectedScenario).to.be.deep.equal(null);
    });
  });

  describe('#getValidState', () => {
    it('should return a valid state within a Given', () => {
      const stateText = 'the cat does this';
      const validState = `Given ${stateText}`;

      const expectedState = analyzer['getValidState'](validState, '');

      expect(expectedState).to.be.not.equal('');
      expect(expectedState).to.be.deep.equal(stateText);
    });

    it('should return a valid state within a And', () => {
      const stateText = 'the cat does that';
      const validState = `And ${stateText}`;

      const expectedState = analyzer['getValidState'](validState, 'state');

      expect(expectedState).to.be.not.equal('');
      expect(expectedState).to.be.deep.equal(stateText);
    });

    it('should return a valid state within a But', () => {
      const stateText = 'the cat does not do that';
      const validState = `But ${stateText}`;

      const expectedState = analyzer['getValidState'](validState, 'state');

      expect(expectedState).to.be.not.equal('');
      expect(expectedState).to.be.deep.equal(stateText);
    });

    it('should not return a valid feature', () => {
      const invalidState = 'This is not valid';

      const expectedState = analyzer['getValidState'](invalidState, '');

      expect(expectedState).to.be.deep.equal(null);
    });
  });

  describe('#getValidAction', () => {
    it('should return a valid state within a When', () => {
      const actionText = 'the cat does this';
      const validAction = `When ${actionText}`;

      const expectedAction = analyzer['getValidAction'](validAction, '');

      expect(expectedAction).to.be.not.equal('');
      expect(expectedAction).to.be.deep.equal(actionText);
    });

    it('should return a valid action within a And', () => {
      const actionText = 'the cat does that';
      const validAction = `And ${actionText}`;

      const expectedAction = analyzer['getValidAction'](validAction, 'action');

      expect(expectedAction).to.be.not.equal('');
      expect(expectedAction).to.be.deep.equal(actionText);
    });

    it('should return a valid action within a But', () => {
      const actionText = 'the cat does not do that';
      const validAction = `But ${actionText}`;

      const expectedAction = analyzer['getValidAction'](validAction, 'action');

      expect(expectedAction).to.be.not.equal('');
      expect(expectedAction).to.be.deep.equal(actionText);
    });

    it('should not return a valid feature', () => {
      const invalidAction = 'This is not valid';

      const expectedAction = analyzer['getValidAction'](invalidAction, '');

      expect(expectedAction).to.be.deep.equal(null);
    });
  });

  describe('#getValidOutcome', () => {
    it('should return a valid outcome within a Then', () => {
      const outcomeText = 'the cat does this';
      const validOutcome = `Then ${outcomeText}`;

      const expectedOutcome = analyzer['getValidOutcome'](validOutcome, '');

      expect(expectedOutcome).to.be.not.equal('');
      expect(expectedOutcome).to.be.deep.equal(outcomeText);
    });

    it('should return a valid outcome within a And', () => {
      const outcomeText = 'the cat does that';
      const validOutcome = `And ${outcomeText}`;

      const expectedOutcome = analyzer['getValidOutcome'](validOutcome, 'outcome');

      expect(expectedOutcome).to.be.not.equal('');
      expect(expectedOutcome).to.be.deep.equal(outcomeText);
    });

    it('should return a valid outcome within a But', () => {
      const outcomeText = 'the cat does not do that';
      const validOutcome = `But ${outcomeText}`;

      const expectedOutcome = analyzer['getValidOutcome'](validOutcome, 'outcome');

      expect(expectedOutcome).to.be.not.equal('');
      expect(expectedOutcome).to.be.deep.equal(outcomeText);
    });

    it('should not return a valid feature', () => {
      const invalidOutcome = 'This is not valid';

      const expectedOutcome = analyzer['getValidOutcome'](invalidOutcome, '');

      expect(expectedOutcome).to.be.deep.equal(null);
    });
  });
});
