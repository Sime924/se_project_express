class ConflictErr extends error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ConflictErr;
