import Parrot from 'parrot-core';

class ParrotHotMiddleware extends Parrot {
  normalizeRequest(req) {
    return req;
  }

  resolver(req, res, next) {
    return response => {
      if (res.headersSent) {
        return;
      }
      if (!response) {
        next();
        return;
      }

      const { body, status } = response;
      res.status(status);

      if (typeof body === 'object') {
        res.json(body);
      } else if (typeof body === 'undefined') {
        res.sendStatus(status);
      } else {
        res.send(body);
      }
    };
  }
}

export default function parrotHotMiddleware({ scenarios = [] } = {}) {
  // initialize class instance
  // watch scenario files with chokidar
  // update scenarios when they change
  // test that esm cache can be deleted
}
