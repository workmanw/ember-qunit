import moduleFor from './module-for';
import Ember from 'ember';

export default function moduleForModel(name, description, callbacks) {
  if (!DS) throw new Error('You must have Ember Data installed to use `moduleForModel`.');

  moduleFor('model:' + name, description, callbacks, function(container, context, defaultSubject) {
    if (DS._setupContainer) {
      DS._setupContainer(container);
    } else {
      container.register('store:main', DS.Store);
    }

    var adapterFactory = container.lookupFactory('adapter:application');
    if (!adapterFactory) {
      container.register('adapter:application', DS.FixtureAdapter);
    }

    context.__setup_properties__.store = function(){
      return container.lookup('store:main');
    };

    if (context.__setup_properties__.subject === defaultSubject) {
      context.__setup_properties__.subject = function(options) {
        return Ember.run(function() {
          return container.lookup('store:main').createRecord(name, options);
        });
      };
    }
  });
}
