Data Munging and Reports
========================

The raw data comes to use in PDF form from AT&T's account/billing page. The `scraperJSON.py` script turns those into usable JSON.

scraperJSON.py setup
--------------------

You'll need [pip](https://pypi.python.org/pypi/pip) to get the dependencies. If you don't already have pip:

```
sudo easy_install pip
```

then, in this directory (you may need to sudo if you arent using a virtualenv)

```
pip install PyPDF2
pip install python-dateutil
```

Generating JSON
---------------

The raw data from AT&T uses actual phone numbers - in the filename (this is the device in question - don't rename that file we need that) - and in the call/sms log. We map these to device IDs to anonymize and allow us to publish the JSON data files. `lookup.example.json` has an example of the format - copy this to `lookup.json` and populate it with the actual phone numbers and device IDs.

Then, to produce the JSON output:

```
python scraperJSON.py 'path/to/the/ATandT/download/999-999-9999_Data and Text Usage_10_3_2016_10_10_2016.pdf' > 999-999-9999.json
```

